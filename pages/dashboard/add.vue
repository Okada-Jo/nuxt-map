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
        {{ $t('Add Location') }}
      </h1>
      <p class="text-sm">
        {{ $t('Location description') }}
      </p>

      <LocationForm
        :on-submit
        :on-submit-complete
        :submit-label="$t('Add')"
        submit-icon="tabler:circle-plus-filled"
      />
    </div>
  </div>
</template>
