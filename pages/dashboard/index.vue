<script setup lang="ts">
const isSidebarOpen = ref(true);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem('isSidebarOpen') === 'true';
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('isSidebarOpen', isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-200 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        :class="{ 'justify-end': isSidebarOpen, 'justify-center': !isSidebarOpen }"
        class="flex hover:cursor-pointer hover:bg-base-100 p-2"
        @click="toggleSidebar"
      >
        <Icon :name="isSidebarOpen ? 'tabler-chevron-left' : 'tabler-chevron-right'" size="32" />
      </div>
      <div class="flex flex-col">
        <SidebarButton href="/dashboard" :show-label="isSidebarOpen" label="Locations" icon="tabler:map" />
        <SidebarButton href="/dashboard/add" :show-label="isSidebarOpen" label="Add Location" icon="tabler:circle-plus-filled" />

        <div class="divider" />

        <SidebarButton href="/signout" :show-label="isSidebarOpen" label="Sign Out" icon="tabler:logout-2" />
      </div>
    </div>
    <div class="flex-1">
      Main
    </div>
  </div>
</template>
