<script setup lang="ts">
// Простой компонент без сложной логики
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">🍳 Cooking App</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Добро пожаловать в приложение для готовки!</h2>
        <p class="text-gray-600 mb-6">
          Здесь вы можете найти рецепты, планировать меню и вести дневник кулинарных экспериментов.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 class="text-lg font-medium text-blue-900 mb-2">📖 Рецепты</h3>
            <p class="text-blue-700 text-sm">Большая коллекция проверенных рецептов</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 class="text-lg font-medium text-green-900 mb-2">📅 Планирование</h3>
            <p class="text-green-700 text-sm">Планируйте меню на неделю</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 class="text-lg font-medium text-purple-900 mb-2">⭐ Избранное</h3>
            <p class="text-purple-700 text-sm">Сохраняйте любимые рецепты</p>
          </div>
        </div>
        
        <button class="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Начать готовить
        </button>
      </div>
    </div>
  </div>
</template>
