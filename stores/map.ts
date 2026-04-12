import type { LngLatBounds } from 'maplibre-gl';

import type { MapPoint } from '~/lib/types';

const BOUND_PADDING = 60;

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const shouldFlyTo = ref(false);

  let bounds: LngLatBounds | null = null;

  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl');
    const { LngLatBounds } = await import('maplibre-gl');

    const map = useMap();

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint)
        return;

      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([
        firstPoint.long,
        firstPoint.lat,
      ], [
        firstPoint.long,
        firstPoint.lat,
      ]));

      map.map?.fitBounds(bounds, {
        padding: BOUND_PADDING,
      });
    });

    effect(() => {
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          map.map?.flyTo({
            center: [selectedPoint.value.long, selectedPoint.value.lat],
            speed: 0.75,
          });
        }
        shouldFlyTo.value = false;
      }
      else if (bounds) {
        map.map?.fitBounds(bounds, {
          padding: BOUND_PADDING,
        });
      }
    });
  }

  function selectPoint(point: MapPoint | null, { disableFlyTo = false } = {}) {
    shouldFlyTo.value = !disableFlyTo;
    selectedPoint.value = point;
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    selectPoint,
  };
});
