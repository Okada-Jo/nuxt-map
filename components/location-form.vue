<script setup lang="ts">
import { OSAKA } from '~/lib/constants';
import { InsertLocation } from '~/lib/db/schema';

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :schema="InsertLocation"
    :zoom="props.zoom || 6"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      long: (OSAKA as [number, number])[0],
      lat: (OSAKA as [number, number])[1],
    }"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
  >
    <AppFormField
      name="name"
      :label="$t('Name')"
      :error="errors.name"
      :disabled="loading"
    />
    <AppFormField
      name="description"
      :label="$t('Description')"
      type="textarea"
      :error="errors.description"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
