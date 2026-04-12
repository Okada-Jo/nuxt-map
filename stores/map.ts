import type { LngLatBounds } from 'maplibre-gl';

import type { MapPoint } from '~/lib/types';

const BOUND_PADDING = 60;

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint | null>(null);

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

    watch(addedPoint, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          speed: 0.75,
          zoom: 6,
        });
      }
    }, {
      immediate: true,
    });
  }

  function selectPoint(point: MapPoint | null) {
    selectedPoint.value = point;
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    selectPoint,
    addedPoint,
  };
});
