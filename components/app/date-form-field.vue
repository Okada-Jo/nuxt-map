<script setup lang="ts">
import { formatDate } from '~/utils/format-date';

const props = defineProps<{
  error?: string;
  label: string;
  name: string;
  disabled?: boolean;
  value: number;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,

});

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="disabled"
      class="w-full input"
      :class="[
        error && 'input-error',
      ]"
      :value="formatDate(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
