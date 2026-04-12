<script setup lang="ts">
import type { FetchError } from 'ofetch';

import type { NominatimResult } from '~/lib/types';

import { SearchSchema } from '~/lib/zod-schemas';
import getFetchErrorMessage from '~/utils/get-fetch-error-message';

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref('');
const form = useTemplateRef('form');

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    errorMessage.value = '';
    searchResults.value = [];
    const results = await $fetch('/api/search', {
      query,
    });

    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;

    errorMessage.value = getFetchErrorMessage(error);
  }
  loading.value = false;
}

function setLocation(result: NominatimResult) {
  emit('resultSelected', result);
  hasSearched.value = false;
  errorMessage.value = '';
  searchResults.value = [];
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="SearchSchema"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              :disabled="loading"
              placeholder="Search for a location..."
              :class="{
                'input-error': errors.q,
              }"
            />
          </label>
          <div v-if="errors.q" class="validator-hint visible text-error">
            {{ errors.q }}
          </div>
        </div>
        <button
          :disabled="loading"
          class="btn btn-neutral join-item"
        >
          Search
        </button>
      </div>
    </Form>
    <div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="!loading && hasSearched && searchResults.length === 0"
      role="alert"
      class="alert alert-warning alert-outline"
    >
      No results found
    </div>

    <div v-if="loading" class="flex justify-center mt-4">
      <span class="loading loading-lg loading-spinner" />
    </div>

    <div class="flex flex-col overflow-auto gap-2 max-h-64 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>

          <div class="justify-end card-actions">
            <button
              class="btn btn-warning btn-sm"
              @click="setLocation(result)"
            >
              Set Location
              <Icon name="tabler:map-pin-share" size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
