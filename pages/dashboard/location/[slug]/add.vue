<script setup lang="ts">
import type { InsertLocationLog } from '~/lib/db/schema';

import { OSAKA } from '~/lib/constants/constants';

const route = useRoute();
const { currentLocation } = useLocationStore();
const localePath = useLocalePath();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: 'post',
    body: values,
  });
}

function submitComplete() {
  navigateTo(localePath({
    name: 'dashboard-location-slug',
    params: {
      slug: route.params.slug,
    },
  }));
}
</script>

<template>
  <LocationLogForm
    submit-label="Add Location Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - 24 * 60 * 60 * 1000,
      endedAt: Date.now(),
      long: currentLocation?.long || (OSAKA as [number, number])[0],
      lat: currentLocation?.lat || (OSAKA as [number, number])[1],
    }"
  />
</template>
