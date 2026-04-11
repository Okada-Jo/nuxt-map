<script setup lang="ts">
const props = defineProps<{
  error?: string;
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'number';
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="type === 'textarea' ? 'textarea' : 'input'"
      :name="props.name"
      :type="type || 'text'"
      :disabled="disabled"
      class="w-full"
      :class="[
        error && 'input-error',
        type === 'textarea' ? 'textarea' : 'input',
      ]"
    />
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
