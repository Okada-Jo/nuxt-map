<script setup lang="ts">
import type { FetchError } from 'ofetch';

const route = useRoute();
const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();
const locationsStore = useLocationStore();
const {
  currentLocation: location,
  currentLocationError: error,
  currentLocationStatus: status,
} = storeToRefs(locationsStore);

const isOpen = ref(false);
const isDeleting = ref(false);
const deleteError = ref('');

const loading = computed(() => status.value === 'pending' || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

function openDialog() {
  isOpen.value = true;

  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = '';
    isDeleting.value = true;
    await $fetch(`/api/locations/${route.params.slug}/`, {
      method: 'DELETE',
    });

    navigateTo(localePath('dashboard'));
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  isDeleting.value = false;
}

onMounted(() => {
  nextTick(() => {
    locationsStore.refreshCurrentLocation();
  });
});

onBeforeRouteUpdate((to) => {
  const baseName = getRouteBaseName(to);
  if (baseName === 'dashboard-location-slug') {
    locationsStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="p-4 min-h-64">
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
      v-if="getRouteBaseName(route) === 'dashboard-location-slug' && location && !loading"
    >
      <div class="flex gap-2">
        <h2 class="text-xl">
          {{ location?.name }}
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
                  name: 'dashboard-location-slug-edit',
                  params: {
                    slug: route.params.slug,
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
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div
        v-if="!location.locationLogs.length"
        class="mt-4"
      >
        <p
          class="text-sm italic"
        >
          Add a location log to get started.
        </p>
      </div>
      <button class="btn btn-primary mt-2">
        Add location log
        <Icon name="tabler:map-pin-plus" size="24" />
      </button>
    </div>
    <div v-if="getRouteBaseName(route) !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      :is-open
      title="Are you sure?"
      description="Deleting the location also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-text="Yes, delete this location"
      confirm-button-class="btn-error"
      @on-confirmed="confirmDelete"
      @on-closed="isOpen = false"
    />
  </div>
</template>
