<script lang="ts" setup>
const { loading, signIn } = useAuthStore();
</script>

<template>
  <button
    :disabled="loading"
    class="btn btn-accent"
    @click="signIn"
  >
    Sign in with github
    <span v-if="loading" class="loading loading-spinner loading-md" />
    <Icon v-else name="tabler:brand-github" size="24" />
  </button>
</template>
