<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  confirmButtonClass:
    'btn-warning'
    | 'btn-error'
    | 'btn-primary'
    | 'btn-secondary'
    | 'btn-tertiary';
}>();

const emit = defineEmits<{
  onClosed: [];
  onConfirmed: [];
}>();

const dialog = useTemplateRef('dialog');

function onClose() {
  emit('onClosed');
}

function onConfirmed() {
  emit('onClosed');
  emit('onConfirmed');
}

onMounted(() => {
  dialog.value?.addEventListener('close', onClose);
});
onUnmounted(() => {
  dialog.value?.removeEventListener('close', onClose);
});
</script>

<template>
  <dialog
    ref="dialog"
    :open="props.isOpen"
    class="modal"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>
      <p class="py-4">
        {{ description }}
      </p>
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-outline"
          @click="onClose"
        >
          Cancel
        </button>
        <button
          class="btn"
          :class="confirmButtonClass"
          @click="onConfirmed"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
