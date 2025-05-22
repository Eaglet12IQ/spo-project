<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-primary-800 mb-6">Админ Панель</h1>
    <p class="text-primary-700 mb-6">Добро пожаловать в административную панель. Здесь вы можете управлять приложением.</p>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Пользователи</h2>
      <table class="min-w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Имя пользователя</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Роль</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ user.id }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ user.username }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ user.email }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">Коллекционеры</h2>
      <table class="min-w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Аватар</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Страна</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Телефон</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Имя</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Фамилия</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Отчество</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="collector in collectors" :key="collector.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ collector.id }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <img :src="collector.avatar_url" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ collector.country }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ collector.phone_number }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ collector.first_name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ collector.last_name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ collector.middle_name }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAdminStore } from '../stores/adminStore'

const adminStore = useAdminStore()
const users = ref([])
const collectors = ref([])

async function loadData() {
  await adminStore.fetchUsers()
  await adminStore.fetchCollectors()
  users.value = adminStore.users
  collectors.value = adminStore.collectors
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Add any specific styles for admin panel here */
</style>
