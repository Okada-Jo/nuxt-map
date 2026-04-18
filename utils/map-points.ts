import type { SelectLocation, SelectLocationLog } from '~/lib/db/schema';
import type { MapPoint } from '~/lib/types';

export function createMapPointFromLocation(location: SelectLocation): MapPoint {
  const localePath = useLocalePath();
  return {
    ...location,
    to: localePath({ name: 'dashboard-location-slug', params: { slug: location.slug } }),
    toLabel: 'View',
  };
}

export function createMapPointFromLocationLog(locationLog: SelectLocationLog): MapPoint {
  const localePath = useLocalePath();
  if (!locationLog.id) {
    console.warn('createMapPointFromLocationLog: locationLog.id is missing', locationLog);
  }
  return {
    ...locationLog,
    to: localePath({ name: 'dashboard-location-slug-id', params: { id: locationLog.id } }),
    toLabel: 'View',
  };
}

export function isPointSelected(item: Pick<MapPoint, 'id' | 'lat' | 'long'> | null | undefined, selectedPoint: MapPoint | null | undefined) {
  if (!item || !selectedPoint)
    return false;

  return (
    item.id === selectedPoint.id
    && item.lat === selectedPoint.lat
    && item.long === selectedPoint.long
  );
}
