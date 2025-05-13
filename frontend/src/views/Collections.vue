<template>
  <div class="collections-page min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-primary-900 font-serif">Коллекции</h1>
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CollectionCard v-for="collection in collectionStore.collections" :key="collection.id" :collection="collection" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCollectionStore } from '../stores/collectionStore'
import CollectionCard from '../components/CollectionCard.vue'

const collectionStore = useCollectionStore()
</script>