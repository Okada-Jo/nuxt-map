<script setup lang="ts">
const route = useRoute();
const getRouteBaseName = useRouteBaseName();
const locationsStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationsStore);

onMounted(() => {
  nextTick(() => {
    locationsStore.refreshCurrentLocation();
  });
});

onBeforeRouteUpdate((to) => {
  const baseName = getRouteBaseName(to);
  if (baseName === 'dashboard-location-slug') {
    locationsStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading loading-spinner" />
    </div>

    <div
      v-if="error && status !== 'pending'"
      class="alert alert-error text-lg"
    >
      <h2>
        {{ error.statusMessage }}
      </h2>
    </div>

    <div v-if="getRouteBaseName(route) === 'dashboard-location-slug' && location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location?.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div
        v-if="!location.locationLogs.length"
        class="mt-4"
      >
        <p
          class="text-sm italic"
        >
          Add a location log to get started.
        </p>
      </div>
      <button class="btn btn-primary mt-2">
        Add location log
        <Icon name="tabler:map-pin-plus" size="24" />
      </button>
    </div>
    <div v-if="getRouteBaseName(route) !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
  </div>
</template>
