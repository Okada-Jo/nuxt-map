<script setup lang="ts" generic="T extends LatLongItem">
import type { FetchError } from 'ofetch';
import type { ZodSchema } from 'zod';

import { ne } from 'drizzle-orm';

import type { LatLongItem, NominatimResult } from '~/lib/types';

import { OSAKA } from '~/lib/constants';

const props = defineProps<{
  initialValues: T;
  schema: ZodSchema;
  onSubmit: (location: T) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom: number;
}>();

const router = useRouter();
const mapStore = useMapStore();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref('');

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: props.schema,
  initialValues: props.initialValues,
});

const onSubmit = handleSubmit(async (values) => {
  const formValues = values as T;
  try {
    submitError.value = '';
    loading.value = true;
    props.onSubmit(formValues);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function searchResultSelected(result: NominatimResult) {
  setFieldValue('name', result.display_name);
  mapStore.addedPoint = {
    name: 'Added point',
    id: 1,
    description: '',
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue('long', mapStore.addedPoint.long);
    setFieldValue('lat', mapStore.addedPoint.lat);
  }
});

function formatNumber(value: number) {
  return value.toFixed(5);
}

onMounted(() => {
  nextTick(() => {
    mapStore.addedPoint = {
      name: 'Added point',
      id: 1,
      description: '',
      long: props.initialValues?.long || (OSAKA as [number, number])[0],
      lat: props.initialValues?.lat || (OSAKA as [number, number])[1],
      zoom: props.zoom,
    };
  });
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm('Are you sure you want to leave? All unsaved changes will be lost.');
    if (!confirm) {
      return false;
    }
  }

  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{{ submitError }}</span>
  </div>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <slot :errors="errors" :loading />
    <p v-if="controlledValues.lat && controlledValues.long" class="text-xs opacity-65">
      {{ $t('Current coordinates:') }}
      {{ formatNumber(controlledValues.lat) }},
      {{ formatNumber(controlledValues.long) }}
    </p>
    <p>
      {{ $t('To set the coordinates:') }}
    </p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        {{ $t('Drag the') }}
        <Icon
          name="tabler:map-pin-filled"
          size="16"
          class="text-warning"
        />
        {{ $t('on the map.') }}
      </li>
      <li>
        {{ $t('Click on the map directly.') }}
      </li>
      <li>
        {{ $t('Search for a location below.') }}
      </li>
    </ul>
    <div class="flex justify-end gap-2">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
        @click="router.back"
      >
        <Icon name="tabler:arrow-left" size="24" />
        {{ $t('Cancel') }}
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-if="!loading"
          :name="props.submitIcon"
          size="24"
        />
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
