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
        <span class="tooltip tooltip-top" :data-tip="point.label">

          <Icon
            name="tabler:map-pin-filled"
            size="32"
            class="text-secondary"
          />
        </span>
      </template>
    </MglMarker>
  </MglMap>
</template>
