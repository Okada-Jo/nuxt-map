<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();
const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="!showLabel ? props.label : undefined">
    <NuxtLink
      :to="props.href"
      :class="{ 'bg-base-300': route.path === href, 'justify-center': !showLabel, 'justify-start': showLabel }"
      class="flex gap-2 p-2 hover:bg-base-300 hover:cursor-pointer whitespace-nowrap"
    >
      <Icon :name="props.icon" size="24" />
      <Transition name="grow">
        <span v-if="showLabel">
          {{ props.label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-enter-active {
  transition: all 0.3s ease-out;
}

.grow-leave-active {
  transition: all 0.3s ease-in;
}

.grow-enter-from,
.grow-leave-to {
  opacity: 0;
  letter-spacing: -5px;
  filter: blur(4px);
}
</style>
