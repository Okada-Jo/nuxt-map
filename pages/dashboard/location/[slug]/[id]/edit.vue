<script setup lang="ts">
import type { InsertLocationLog } from '~/lib/db/schema';

const route = useRoute();
const localePath = useLocalePath();
const locationsStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogError: error,
  currentLocationLogStatus: status,
} = storeToRefs(locationsStore);

async function onSubmit(values: InsertLocationLog) {
  console.log(values);
}

function submitComplete() {
  navigateTo(localePath({
    name: 'dashboard-location-slug-id',
    params: {
      slug: route.params.slug,
      id: route.params.id,
    },
  }));
}
</script>

<template>
  <LocationLogForm
    v-if="locationLog"
    submit-label="Update Location Log"
    submit-icon="tabler:map-pin-up"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="locationLog"
  />
</template>
