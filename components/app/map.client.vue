<script setup lang="ts">
import type { LngLat, MapMouseEvent } from 'maplibre-gl';

import { OSAKA } from '~/lib/constants/constants';

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  if (colorMode.value === 'dark') {
    return '/styles/dark.json';
  }

  return 'https://tiles.openfreemap.org/styles/liberty';
});
const initialCenter = OSAKA;
const initialZoom = 6;

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint = {
      ...mapStore.addedPoint,
      lat: location.lat,
      long: location.lng,
    };
  }
}

function setAddedPoint(mglEvent: { event: MapMouseEvent }) {
  const newCoords = mglEvent.event.lngLat;

  if (mapStore.addedPoint && newCoords) {
    mapStore.addedPoint = {
      ...mapStore.addedPoint,
      lat: newCoords.lat,
      long: newCoords.lng,
    };
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="initialCenter"
    :zoom="initialZoom"
    @map:click="setAddedPoint"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="mapStore.addedPoint"
      draggable
      :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <span
          class="tooltip tooltip-open hover:cursor-drag"
          data-tip="Drag to your desired location"
        >

          <Icon
            name="tabler:map-pin-filled"
            size="36"
            class="text-warning"
          />
        </span>
      </template>
    </MglMarker>

    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <span
          class="tooltip hover:cursor-pointer"
          :class="{
            'tooltip-open': mapStore.selectedPoint === point,
          }"
          :data-tip="point.name"
          @mouseenter="mapStore.selectPoint(point)"
          @mouseleave="mapStore.selectPoint(null)"
        >

          <Icon
            name="tabler:map-pin-filled"
            size="32"
            :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
          />
        </span>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
