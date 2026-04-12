<script setup lang="ts">
import { OSAKA } from '~/lib/constants/constants';

const colorMode = useColorMode();

const style = computed(() => {
  if (colorMode.value === 'dark') {
    return '/styles/dark.json';
  }

  return 'https://tiles.openfreemap.org/styles/liberty';
});
const center = OSAKA;
const zoom = 7;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>
