<script lang="ts" setup>
const authStore = useAuthStore();
const { loading, user } = storeToRefs(authStore);
const { signIn } = authStore;
</script>

<template>
  <ClientOnly>
    <div v-if="!loading && user && user.name" class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn m-1"
      >
        <div v-if="user.image" class="avater">
          <div class="w-8 rounded-full">
            <img
              :src="user.image"
              :alt="user.name"
            >
          </div>
        </div>
        {{ user.name }}
      </div>
      <ul tabindex="-1" class="dropdown-content menu bg-base-200 text-red-200 rounded-box z-1 w-52 p-2 shadow-sm">
        <li>
          <NuxtLink to="/signout">
            <Icon name="tabler:logout-2" size="24" />
            Sign Out
          </NuxtLink>
        </li>
      </ul>
    </div>
    <button
      v-else
      :disabled="loading"
      class="btn btn-accent"
      @click="signIn"
    >
      Sign in with github
      <span v-if="loading" class="loading loading-spinner loading-md" />
      <Icon
        v-else
        name="tabler:brand-github"
        size="24"
      />
    </button>
  </ClientOnly>
</template>
