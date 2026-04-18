import type { LngLatLike } from 'maplibre-gl';

export const OSAKA = [135.49751, 34.634637] as LngLatLike;

export const LOCATION_PAGES = new Set([
  'dashboard',
  'dashboard-add',
]);
export const CURRENT_LOCATION_PAGES = new Set([
  'dashboard-location-slug',
  'dashboard-location-slug-add',
  'dashboard-location-slug-edit',
]);
export const CURRENT_LOCATION_LOG_PAGES = new Set([
  'dashboard-location-slug-id',
  'dashboard-location-slug-id-add',
  'dashboard-location-slug-id-edit',
]);
export const EDIT_PAGES = new Set([
  'dashboard-add',
  'dashboard-location-slug-add',
  'dashboard-location-slug-edit',
]);
