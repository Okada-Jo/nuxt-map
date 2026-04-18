import type { LngLatBounds } from 'maplibre-gl';

import type { MapPoint } from '~/lib/types';

import { OSAKA } from '~/lib/constants/constants';

const BOUND_PADDING = 60;
const MAX_ZOOM = 5;

export const useMapStore = defineStore('useMapStore', () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean; zoom?: number } | null>(null);

  let bounds: LngLatBounds | null = null;

  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl');
    const { LngLatBounds } = await import('maplibre-gl');

    const map = useMap();

    effect(() => {
      const firstPoint = mapPoints.value[0];
      if (!firstPoint) {
        map.map?.flyTo({
          center: [
            (OSAKA as [number, number])[0],
            (OSAKA as [number, number])[1],
          ],
          zoom: 2,
        });
        return;
      }

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
        maxZoom: MAX_ZOOM,
      });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          speed: newValue.centerMap ? 1.25 : 0.75,
          zoom: newValue.zoom || 6,
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
