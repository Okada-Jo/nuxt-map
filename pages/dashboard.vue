<script setup lang="ts">
import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from '~/lib/constants';
import { useLocationStore } from '~/stores/locations';
import { useSidebarStore } from '~/stores/sidebar';
import { isPointSelected } from '~/utils/map-points';

const isSidebarOpen = useState('sidebar', () => true);
const route = useRoute();
const locationsStore = useLocationStore();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();

const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore);

const localePath = useLocalePath();
const getRouteBaseName = useRouteBaseName();

if (LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
  await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '') || CURRENT_LOCATION_LOG_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
  await locationsStore.refreshCurrentLocation();
}

if (CURRENT_LOCATION_LOG_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
  await locationsStore.refreshCurrentLocationLog();
}

onMounted(() => {
  nextTick(() => {
    isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
  });
});

effect(() => {
  locationsStore.updateSidebar(route);
  if (LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
    sidebarStore.sidebarTopItems = [{
      id: 'link-dashboard',
      label: $t('Locations'),
      href: localePath('/dashboard'),
      icon: 'tabler:map',
    }, {
      id: 'link-dashboard-add',
      label: $t('Add Location'),
      href: localePath('/dashboard/add'),
      icon: 'tabler:circle-plus-filled',
    }];
  }
  else if (CURRENT_LOCATION_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
    sidebarStore.sidebarTopItems = [{
      id: 'link-dashboard-back',
      label: 'Back to Locations',
      href: localePath('/dashboard'),
      icon: 'tabler:arrow-left',
    }];
    if (currentLocation.value && currentLocationStatus.value !== 'pending') {
      sidebarStore.sidebarTopItems.push({
        id: 'link-location',
        label: currentLocation.value.name,
        to: localePath({
          name: 'dashboard-location-slug',
          params: {
            slug: route.params.slug,
          },
        }),
        icon: 'tabler:map',
      }, {
        id: 'link-location-edit',
        label: $t('Edit Location'),
        to: localePath({
          name: 'dashboard-location-slug-edit',
          params: {
            slug: route.params.slug,
          },
        }),
        icon: 'tabler:map-pin-cog',
      }, {
        id: 'link-location-add',
        label: $t('Add Location Log'),
        to: localePath({
          name: 'dashboard-location-slug-add',
          params: {
            slug: route.params.slug,
          },
        }),
        icon: 'tabler:circle-plus-filled',
      });
    }
  }
  else if (CURRENT_LOCATION_LOG_PAGES.has(getRouteBaseName(route)?.toString() || '')) {
    if (currentLocation.value && currentLocationStatus.value !== 'pending') {
      sidebarStore.sidebarTopItems = [{
        id: 'link-location',
        label: `Back to "${currentLocation.value.name}"`,
        to: localePath({
          name: 'dashboard-location-slug',
          params: {
            slug: route.params.slug,
          },
        }),
        icon: 'tabler:arrow-left',
      }, {
        id: 'link-location-log-id',
        label: 'View Log',
        to: localePath({
          name: 'dashboard-location-slug-id',
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        }),
        icon: 'tabler:map-pin',
      }, {
        id: 'link-edit-location-log-id',
        label: $t('Edit Log'),
        to: localePath({
          name: 'dashboard-location-slug-id-edit',
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        }),
        icon: 'tabler:map-pin-cog',
      }];
    }
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div
      class="bg-base-100 transition-all duration-300 shrink-0"
      :class="[isSidebarOpen ? 'w-64' : 'w-16']"
    >
      <div
        :class="[isSidebarOpen ? 'justify-end' : 'justify-center']"
        class="flex hover:cursor-pointer hover:bg-base-300 p-2"
        @click="toggleSidebar"
      >
        <Icon :name="isSidebarOpen ? 'tabler-chevron-left' : 'tabler-chevron-right'" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :href="item.href"
          :to="item.to"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
        />
        <div
          v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'"
          class="flex items-center justify-center"
        >
          <div class="loading" />
        </div>
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="sidebarStore.sidebarItems.length && !sidebarStore.loading" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectPoint(item.mapPoint ?? null)"
            @mouseleave="mapStore.selectPoint(null)"
          />
        </div>
        <div class="divider" />

        <SidebarButton
          href="/signout"
          :show-label="isSidebarOpen"
          :label="$t('Sign Out')"
          icon="tabler:logout-2"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full"
        :class="{
          'flex-col': !EDIT_PAGES.has(getRouteBaseName(route)?.toString() || ''),
        }"
      >
        <NuxtPage
          :class="{
            'w-96': EDIT_PAGES.has(getRouteBaseName(route)?.toString() || ''),
            'shrink-0': EDIT_PAGES.has(getRouteBaseName(route)?.toString() || ''),
          }"
        />
        <div class="flex-1">
          <AppMap />
        </div>
      </div>
    </div>
  </div>
</template>
