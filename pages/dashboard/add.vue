<script setup lang="ts">
import type { InsertLocation } from '~/lib/db/schema';

const localePath = useLocalePath();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch('/api/locations', {
    method: 'post',
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo(localePath('dashboard'));
}
</script>

<template>
  <div class="container max-w-md mx-auto mt-4 p-4">
    <div class="flex flex-col gap-3">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>

      <LocationForm
        :on-submit
        :on-submit-complete
        submit-label="Add"
        submit-icon="tabler:circle-plus-filled"
      />
    </div>
  </div>
</template>
