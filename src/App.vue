<script setup lang="ts">
import { provide } from 'vue'
import HomeView from './views/HomeView.vue'
import ErudaDebugger from './components/ErudaDebugger.vue'
import { useTelegramUser } from './composables/useTelegramUser'

// Инициализируем Telegram WebApp
const telegramUser = useTelegramUser()

// Предоставляем данные пользователя глобально
provide('telegramUser', telegramUser)
</script>

<template>
  <div id="app">
    <HomeView />
    <ErudaDebugger />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* CSS переменные для Telegram темы */
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
}

/* Применяем тему Telegram если доступна */
body {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
</style>
