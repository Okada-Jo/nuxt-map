<script setup lang="ts">
import { OSAKA } from '~/lib/constants/constants';

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() => {
  if (colorMode.value === 'dark') {
    return '/styles/dark.json';
  }

  return 'https://tiles.openfreemap.org/styles/liberty';
});
const center = OSAKA;
const zoom = 6;

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
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
          @mouseenter="mapStore.selectPoint(point, { disableFlyTo: true })"
          @mouseleave="mapStore.selectPoint(null, { disableFlyTo: true })"
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
