<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="text-xl underline">
        My App
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <a class="btn btn-accent">Sign in <Icon name="table:brand-github" size="24" /></a>
    </div>
  </div>
</template>
