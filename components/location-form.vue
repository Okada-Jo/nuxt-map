<script setup lang="ts">
import type { FetchError } from 'ofetch';

import type { NominatimResult } from '~/lib/types';

import { OSAKA } from '~/lib/constants/constants';
import { InsertLocation } from '~/lib/db/schema/location';

const props = defineProps<{
  initialValues?: InsertLocation | null;
  onSubmit: (location: InsertLocation) => Promise<any>;
}>();

const router = useRouter();
const mapStore = useMapStore();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref('');

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: InsertLocation,
  initialValues: {
    name: props.initialValues?.name || '',
    description: props.initialValues?.description || '',
    long: props.initialValues?.long || (OSAKA as [number, number])[0],
    lat: props.initialValues?.lat || (OSAKA as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values: InsertLocation) => {
  try {
    submitError.value = '';
    loading.value = true;
    props.onSubmit(values);
    submitted.value = true;
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
  mapStore.addedPoint = {
    name: 'Added point',
    id: 1,
    description: '',
    long: props.initialValues?.long || (OSAKA as [number, number])[0],
    lat: props.initialValues?.lat || (OSAKA as [number, number])[1],
  };
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
    <AppFormField
      name="name"
      label="Name"
      :error="errors.name"
      :disabled="loading"
    />
    <AppFormField
      name="description"
      label="Description"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
    />
    <p v-if="controlledValues.lat && controlledValues.long" class="text-xs opacity-65">
      Current coordinates:
      {{ formatNumber(controlledValues.lat) }},
      {{ formatNumber(controlledValues.long) }}
    </p>
    <p>
      To set the coordinates:
    </p>
    <ul class="list-disc ml-4 text-sm">
      <li>
        Drag the
        <Icon
          name="tabler:map-pin-filled"
          size="16"
          class="text-warning"
        />
        on the map.
      </li>
      <li>
        Click on the map directly.
      </li>
      <li>
        Search for a location below.
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
        Cancel
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        Add
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-if="!loading"
          name="tabler:circle-plus-filled"
          size="24"
        />
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
