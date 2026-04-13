<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value);
});

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value);
});
</script>

<template>
  <div class="dropdown">
    <div
      tabindex="0"
      role="button"
      class="btn m-1"
    >
      {{ currentLocale?.flag }}
      {{ currentLocale?.name }}
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
      <li
        v-for="localeOption in availableLocales"
        :key="localeOption.code"
        class="hover:cursor-pointer"
      >
        <NuxtLink :to="switchLocalePath(localeOption.code)">
          {{ localeOption.flag }} {{ localeOption.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
