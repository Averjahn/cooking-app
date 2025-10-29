import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'

/**
 * Composable для работы с переводами
 */
export const useI18n = () => {
  const languageStore = useLanguageStore()

  // Функция для получения перевода по пути
  const t = (path: string): string => {
    const keys = path.split('.')
    let value: any = languageStore.t

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        console.warn(`Translation key "${path}" not found`)
        return path
      }
    }

    return typeof value === 'string' ? value : path
  }

  // Геттер текущего языка
  const currentLanguage = computed(() => languageStore.currentLanguage)

  // Функция для изменения языка
  const setLanguage = (lang: Parameters<typeof languageStore.setLanguage>[0]) => {
    languageStore.setLanguage(lang)
  }

  // Функция для получения правильного склонения (для русского/украинского/казахского)
  const pluralize = (count: number, one: string, two: string, five: string): string => {
    const lang = languageStore.currentLanguage
    
    // Для английского всегда используем множественное число (кроме 1)
    if (lang === 'en') {
      return count === 1 ? one : five
    }

    // Для других языков используем правила склонения
    const lastDigit = count % 10
    const lastTwoDigits = count % 100

    // 11-19 всегда множественное число (5 форма)
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return five
    }

    // Остальные случаи
    switch (lastDigit) {
      case 1:
        return one
      case 2:
      case 3:
      case 4:
        return two
      default:
        return five
    }
  }

  return {
    t,
    currentLanguage,
    setLanguage,
    pluralize
  }
}

