import type { SelectLocationLog, SelectLocationWithLogs } from '~/lib/db/schema';
import type { MapPoint } from '~/lib/types';

import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, LOCATION_PAGES } from '~/lib/constants/constants';
import { createMapPointFromLocation } from '~/utils/map-points';

export const useLocationStore = defineStore ('useLocationStore', () => {
  const route = useRoute();
  const getRouteBaseName = useRouteBaseName();

  const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch('/api/locations', {
    lazy: true,
  });

  const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLog>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();
  const localePath = useLocalePath();

  effect(async () => {
    if (locations.value && LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.name}`,
          label: location.name,
          icon: 'tabler:map-pin-filled',
          to: localePath({ name: 'dashboard-location-slug', params: { slug: location.slug } }),
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      currentLocation.value.locationLogs.forEach((log) => {
        const mapPoint = createMapPointFromLocationLog(log);
        sidebarItems.push({
          id: `location-${log.name}`,
          label: log.name,
          icon: 'tabler:map-pin-filled',
          to: localePath({ name: 'dashboard-location-slug-id', params: { id: log.id } }),
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      if (mapPoints.length) {
        mapStore.mapPoints = mapPoints;
      }
      else {
        mapStore.mapPoints = [currentLocation.value];
      }
    }
    else if (currentLocationLog.value && CURRENT_LOCATION_LOG_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocationLog.value];
    }
    sidebarStore.loading = locationsStatus.value === 'pending' || currentLocationStatus.value === 'pending';

    if (sidebarStore.loading) {
      mapStore.mapPoints = [];
    }
  });

  return {
    locations,
    locationsStatus,
    refreshLocations,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});
