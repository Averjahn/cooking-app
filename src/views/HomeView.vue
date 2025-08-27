<script setup lang="ts">
import { inject } from 'vue'

// Получаем данные Telegram через inject
const telegramUser = inject('telegramUser')

// Функция для демонстрации главной кнопки
const showMainButtonExample = () => {
  if (telegramUser) {
    telegramUser.showMainButton('🍳 Начать готовить!', () => {
      console.log('Главная кнопка нажата!')
      telegramUser.hapticFeedback('success')
      // Здесь можно добавить логику для начала готовки
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Информация о пользователе Telegram -->
      <div v-if="telegramUser.isReady && telegramUser.user" class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 class="text-lg font-medium text-blue-900 mb-2">👤 Информация о пользователе</h3>
        <div class="text-sm text-blue-700 space-y-1">
          <p><strong>ID:</strong> {{ telegramUser.user.id }}</p>
          <p><strong>Имя:</strong> {{ telegramUser.user.first_name }}</p>
          <p v-if="telegramUser.user.last_name"><strong>Фамилия:</strong> {{ telegramUser.user.last_name }}</p>
          <p v-if="telegramUser.user.username"><strong>Username:</strong> @{{ telegramUser.user.username }}</p>
          <p v-if="telegramUser.user.language_code"><strong>Язык:</strong> {{ telegramUser.user.language_code }}</p>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="telegramUser.error" class="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
        <p class="text-red-700">{{ telegramUser.error }}</p>
      </div>

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
        
        <!-- Кнопки управления Telegram WebApp -->
        <div v-if="telegramUser.isReady" class="mt-8 space-y-4">
          <div class="flex flex-wrap gap-4 justify-center">
            <button 
              @click="telegramUser.expandApp()"
              class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              📱 Развернуть приложение
            </button>
            
            <button 
              @click="showMainButtonExample"
              class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              🔘 Показать главную кнопку
            </button>
            
            <button 
              @click="telegramUser.hapticFeedback('medium')"
              class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              📳 Haptic Feedback
            </button>
          </div>
          
          <button 
            @click="telegramUser.closeApp()"
            class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            ❌ Закрыть приложение
          </button>
        </div>
        
        <button class="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Начать готовить
        </button>
      </div>
    </div>
  </div>
</template>
