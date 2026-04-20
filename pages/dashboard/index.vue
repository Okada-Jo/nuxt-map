<script setup lang="ts">
import { useLocationStore } from '~/stores/locations';

const locationsStore = useLocationStore();
const { locations, locationsStatus: status } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshLocations();
});
</script>

<template>
  <div class="page-content-top">
    <h2 class="text-2xl">
      {{ $t('Locations') }}
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div
      v-else-if="locations && locations.length > 0"
      class="location-list"
    >
      <LocationCard
        v-for="location in locations"
        :key="location.id"
        :map-point="createMapPointFromLocation(location)"
      />
    </div>
    <div v-if="status !== 'pending' && !locations || locations?.length === 0" class="flex flex-col gap-2 mt-4">
      <p>{{ $t('Add a location to get started') }}</p>
      <NuxtLink
        to="/dashboard/add"
        class="btn btn-primary w-64"
      >
        {{ $t('Add Location') }}
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
