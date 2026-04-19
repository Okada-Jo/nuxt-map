<script setup lang="ts">
import type { FetchError } from 'ofetch';

const route = useRoute();
const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const locationsStore = useLocationStore();
const {
  currentLocationLog: locationLog,
  currentLocationLogError: error,
  currentLocationLogStatus: status,
} = storeToRefs(locationsStore);

const isOpen = ref(false);
const isDeleting = ref(false);
const deleteError = ref('');

const loading = computed(() => isDeleting.value || status.value === 'pending');
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

function openDialog() {
  isOpen.value = true;

  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = '';
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
      method: 'DELETE',
    });

    navigateTo(localePath({
      name: 'dashboard-location-slug',
      params: {
        slug: route.params.slug,
      },
    }));
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onMounted(() => {
  nextTick(() => {
    locationsStore.refreshCurrentLocationLog();
  });
});

onBeforeRouteUpdate((to) => {
  const baseName = getRouteBaseName(to);
  if (baseName === 'dashboard-location-slug-id') {
    locationsStore.refreshCurrentLocationLog();
  }
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading loading-spinner" />
    </div>

    <div
      v-if="errorMessage && !loading"
      class="alert alert-error text-lg"
    >
      <h2>
        {{ errorMessage }}
      </h2>
    </div>

    <div
      v-if="getRouteBaseName(route) === 'dashboard-location-slug-id' && locationLog && !loading"
    >
      <p class="text-xs italic text-gray-500">
        <span v-if="formatDate(locationLog.startedAt) !== formatDate(locationLog.endedAt)">
          {{ formatDate(locationLog.startedAt) }} / {{ formatDate(locationLog.endedAt) }}
        </span>
        <span v-else>
          {{ formatDate(locationLog.startedAt) }}
        </span>
      </p>
      <div class="flex gap-2 items-center">
        <h2 class="text-xl">
          {{ locationLog?.name }}
        </h2>
        <div class="inline-flex dropdown dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="18" />
          </div>
          <ul
            tabindex="-1"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-30 p-2 shadow-sm"
          >
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath({
                  name: 'dashboard-location-slug-id-edit',
                  params: {
                    slug: route.params.slug,
                    id: route.params.id,
                  },
                })"
              >
                <Icon name="tabler:map-pin-cog" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p class="text-sm">
          {{ locationLog.description }}
        </p>
      </div>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      :is-open
      title="Are you sure?"
      description="Deleting the location log cannot be undone. Do you really want to do this?"
      confirm-text="Yes, delete this log"
      confirm-button-class="btn-error"
      @on-confirmed="confirmDelete"
      @on-closed="isOpen = false"
    />
  </div>
</template>
