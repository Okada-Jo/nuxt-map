<script setup lang="ts">
import type { InsertLocation } from '~/lib/db/schema';

const locationStore = useLocationStore();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  console.log(values);
  // await $csrfFetch('/api/locations', {
  //   method: 'post',
  //   body: values,
  // });
  // navigateTo('/dashboard');
}
</script>

<template>
  <LocationForm
    :on-submit
    :initial-values="locationStore.currentLocation"
  />
</template>
