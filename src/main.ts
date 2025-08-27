import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Инициализируем Telegram WebApp если доступен
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  // Вызываем WebApp.ready() для инициализации
  window.Telegram.WebApp.ready()
  
  // Устанавливаем тему приложения
  const webApp = window.Telegram.WebApp
  if (webApp.themeParams.bg_color) {
    document.documentElement.style.setProperty(
      '--tg-theme-bg-color', 
      webApp.themeParams.bg_color
    )
  }
  if (webApp.themeParams.text_color) {
    document.documentElement.style.setProperty(
      '--tg-theme-text-color', 
      webApp.themeParams.text_color
    )
  }
}

createApp(App).mount('#app')
