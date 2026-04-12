<script setup lang="ts">
import { useLocationStore } from '~/stores/locations';
import { useSidebarStore } from '~/stores/sidebar';

const isSidebarOpen = ref(true);
const route = useRoute();
const locationsStore = useLocationStore();
const sidebarStore = useSidebarStore();

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
  if (route.path !== '/dashboard') {
    locationsStore.refresh();
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
      class="bg-base-200 transition-all duration-300 shrink-0"
      :class="[isSidebarOpen ? 'w-64' : 'w-16']"
    >
      <div
        :class="[isSidebarOpen ? 'justify-end' : 'justify-center']"
        class="flex hover:cursor-pointer hover:bg-base-100 p-2"
        @click="toggleSidebar"
      >
        <Icon :name="isSidebarOpen ? 'tabler-chevron-left' : 'tabler-chevron-right'" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          href="/dashboard"
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map"
        />
        <SidebarButton
          href="/dashboard/add"
          :show-label="isSidebarOpen"
          label="Add Location"
          icon="tabler:circle-plus-filled"
        />

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
          />
        </div>
        <div class="divider" />

        <SidebarButton
          href="/signout"
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <div class="flex flex-col size-full ">
        <NuxtPage />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
