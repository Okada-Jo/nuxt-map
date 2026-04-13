export const useLocationStore = defineStore ('useLocationStore', () => {
  const { data, status, refresh } = useFetch('/api/locations', {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();
  const localePath = useLocalePath();

  effect(() => {
    if (data.value) {
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.name}`,
        label: location.name,
        icon: 'tabler:map-pin-filled',
        to: localePath({ name: 'dashboard-location-slug', params: { slug: location.slug } }),
        location,
      }));

      mapStore.mapPoints = data.value;
    }
    sidebarStore.loading = status.value === 'pending';
  });

  return {
    locations: data,
    status,
    refresh,
  };
});
