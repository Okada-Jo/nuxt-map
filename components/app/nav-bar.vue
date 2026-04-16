<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="text-xl italic">
        Memory-Map
        <Icon name="tabler:map-route" size="20" />
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppLocaleSwitch />
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
