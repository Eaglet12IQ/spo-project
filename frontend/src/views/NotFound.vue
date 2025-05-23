<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-50 px-4">
    <div class="max-w-md w-full text-center">
      <h1 class="text-6xl font-bold text-primary-800 font-serif">404</h1>
      <p class="mt-4 text-xl text-primary-600">Страница не найдена</p>
      <p class="mt-2 text-primary-500">Страница, которую вы ищете, не существует.</p>
      <div class="mt-8">
        <router-link to="/" class="btn-primary">
          Вернутся на главную
        </router-link>
      </div>
    </div>
  </div>
</template>