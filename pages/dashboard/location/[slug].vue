<script setup lang="ts">
const route = useRoute();
const { slug } = route.params;

const { data: location, status, error } = await useFetch(`/api/locations/${slug}`, {
  lazy: true,
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading loading-spinner" />
    </div>
    <div v-if="location && status !== 'pending'">
      <h2 class="text-lg">
        {{ location?.name }}
      </h2>
    </div>

    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2>
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>
