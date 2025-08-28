import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Подключение Telegram WebApp SDK
if (typeof window !== 'undefined') {
  // Ждем загрузки SDK
  const checkTelegramSDK = () => {
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp SDK загружен')
    } else {
      setTimeout(checkTelegramSDK, 100)
    }
  }
  checkTelegramSDK()
}

// Инициализация Telegram WebApp
async function initTelegramWebApp() {
  try {
    // Ждем загрузки SDK
    while (!window.Telegram?.WebApp) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const webApp = window.Telegram.WebApp
    
    // Готовим приложение
    webApp.ready()
    
    // Автоматическое открытие в полноэкранном режиме
    try {
      if (webApp.requestFullscreen) {
        webApp.requestFullscreen()
      } else {
        webApp.expand()
      }
    } catch (error) {
      console.log('Не удалось открыть в полноэкранном режиме:', error)
      // Fallback на expand
      try {
        webApp.expand()
      } catch (expandError) {
        console.log('Не удалось развернуть приложение:', expandError)
      }
    }
    
  } catch (error) {
    console.log('Ошибка инициализации Telegram WebApp:', error)
  }
}

// Основная инициализация
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Инициализируем Telegram WebApp
initTelegramWebApp()

app.mount('#app')
