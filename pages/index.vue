<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-300 container mx-auto mt-6">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          {{ $t('Travel Diary') }}
        </h1>
        <p class="py-6">
          {{ $t('Travel Diary description') }}
        </p>
        <ClientOnly>
          <AuthButton v-if="!authStore.user" />
          <NuxtLink
            v-if="authStore.user"
            to="/dashboard"
            class="btn btn-primary"
          >
            {{ $t('Start Logging') }}
          </NuxtLink>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
