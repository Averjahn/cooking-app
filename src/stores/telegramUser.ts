import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TelegramUser, TelegramWebApp } from '../types/telegram'

export const useTelegramUserStore = defineStore('telegramUser', () => {
  // Состояние
  const user = ref<TelegramUser | null>(null)
  const webApp = ref<TelegramWebApp | null>(null)
  const isReady = ref(false)
  const error = ref<string | null>(null)
  const isTestMode = ref(false)
  const isLoading = ref(false)

  // Геттеры
  const hasUser = computed(() => user.value !== null)
  const userName = computed(() => {
    if (!user.value) return 'Пользователь'
    return user.value.first_name + (user.value.last_name ? ` ${user.value.last_name}` : '')
  })
  const userInitial = computed(() => {
    if (!user.value?.first_name) return 'U'
    return user.value.first_name.charAt(0).toUpperCase()
  })

  // Действия
  const setUser = (userData: TelegramUser) => {
    user.value = userData
    isTestMode.value = false
    isReady.value = true
    error.value = null
    isLoading.value = false
  }

  const setWebApp = (webAppInstance: TelegramWebApp) => {
    webApp.value = webAppInstance
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const enableTestMode = () => {
    const testUser: TelegramUser = {
      id: 123456789,
      first_name: 'Тестовый',
      last_name: 'Пользователь',
      username: 'test_user',
      language_code: 'ru',
      photo_url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=TS'
    }

    user.value = testUser
    isTestMode.value = true
    isReady.value = true
    error.value = null
    isLoading.value = false
  }

  return {
    // Состояние
    user,
    webApp,
    isReady,
    error,
    isTestMode,
    isLoading,
    
    // Геттеры
    hasUser,
    userName,
    userInitial,
    
    // Действия
    setUser,
    setWebApp,
    setLoading,
    setError,
    enableTestMode
  }
})
