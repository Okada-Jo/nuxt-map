<script setup lang="ts">
import type { MapPoint } from '~/lib/types';

defineProps<{
  mapPoint: MapPoint;
}>();
const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    :to="mapPoint.to"
    class="card card-compact bg-base-300 h-40 mb-2 border-2 w-72 shrink-0 hover:cursor-pointer"
    :class="[
      isPointSelected(mapPoint, mapStore.selectedPoint) ? 'border-accent' : 'border-transparent',
    ]"
    @mouseenter="mapStore.selectPoint(mapPoint)"
    @mouseleave="mapStore.selectPoint(null)"
  >
    <div class="card-body">
      <slot name="top" />
      <h3 class="text-xl">
        {{ mapPoint.name }}
      </h3>
      <p>{{ mapPoint.description }}</p>
    </div>
  </NuxtLink>
</template>
