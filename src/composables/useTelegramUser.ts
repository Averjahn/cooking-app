import { ref, readonly, onMounted } from 'vue'
import type { TelegramUser, TelegramWebApp } from '../types/telegram'

export function useTelegramUser() {
  const user = ref<TelegramUser | null>(null)
  const webApp = ref<TelegramWebApp | null>(null)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  const initTelegramApp = () => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        webApp.value = window.Telegram.WebApp
        
        // Инициализируем WebApp
        webApp.value.ready()
        
        // Получаем данные пользователя
        if (webApp.value.initDataUnsafe.user) {
          user.value = webApp.value.initDataUnsafe.user
        }
        
        // Устанавливаем тему приложения
        if (webApp.value.themeParams.bg_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color', 
            webApp.value.themeParams.bg_color
          )
        }
        
        if (webApp.value.themeParams.text_color) {
          document.documentElement.style.setProperty(
            '--tg-theme-text-color', 
            webApp.value.themeParams.text_color
          )
        }
        
        isReady.value = true
        error.value = null
      } else {
        error.value = 'Telegram WebApp не доступен'
        console.warn('Telegram WebApp не найден, запускаем в обычном режиме')
      }
    } catch (err) {
      error.value = `Ошибка инициализации Telegram WebApp: ${err}`
      console.error('Ошибка инициализации Telegram WebApp:', err)
    }
  }

  const expandApp = () => {
    if (webApp.value) {
      webApp.value.expand()
    }
  }

  const closeApp = () => {
    if (webApp.value) {
      webApp.value.close()
    }
  }

  const showMainButton = (text: string, callback: () => void) => {
    if (webApp.value) {
      webApp.value.MainButton.setText(text)
      webApp.value.MainButton.onClick(callback)
      webApp.value.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (webApp.value) {
      webApp.value.MainButton.hide()
    }
  }

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    if (webApp.value) {
      webApp.value.HapticFeedback.impactOccurred(style)
    }
  }

  onMounted(() => {
    initTelegramApp()
  })

  return {
    user: readonly(user),
    webApp: readonly(webApp),
    isReady: readonly(isReady),
    error: readonly(error),
    expandApp,
    closeApp,
    showMainButton,
    hideMainButton,
    hapticFeedback,
    initTelegramApp
  }
}
