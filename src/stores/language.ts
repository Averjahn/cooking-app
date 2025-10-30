import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LocaleMessages } from '../types/i18n'

// Импорт всех переводов
import ru from '../locales/ru'
import en from '../locales/en'
import uk from '../locales/uk'
import kk from '../locales/kk'
import de from '../locales/de'
import fr from '../locales/fr'
import fi from '../locales/fi'
import sv from '../locales/sv'

export type SupportedLanguage = 'ru' | 'en' | 'uk' | 'kk' | 'de' | 'fr' | 'fi' | 'sv'

const translations: Record<SupportedLanguage, LocaleMessages> = { ru, en, uk, kk, de, fr, fi, sv }

export const useLanguageStore = defineStore('language', () => {
  // Текущий язык
  const currentLanguage = ref<SupportedLanguage>('ru')
  
  // Доступные языки
  const availableLanguages: SupportedLanguage[] = ['ru', 'en', 'uk', 'kk', 'de', 'fr', 'fi', 'sv']

  // Получить переводы для текущего языка
  const t = computed<LocaleMessages>(() => {
    return translations[currentLanguage.value] || translations.ru
  })

  // Установить язык
  const setLanguage = (lang: SupportedLanguage) => {
    if (availableLanguages.includes(lang)) {
      currentLanguage.value = lang
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_language', lang)
      }
    }
  }

  // Инициализация языка из Telegram или localStorage
  const initLanguage = (telegramLanguageCode?: string) => {
    // Сначала проверяем сохраненный язык
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language') as SupportedLanguage
      if (saved && availableLanguages.includes(saved)) {
        currentLanguage.value = saved
        return
      }
    }

    // Если есть язык из Telegram, пытаемся использовать его
    if (telegramLanguageCode) {
      const langCode = telegramLanguageCode.toLowerCase().split('-')[0] // 'ru-RU' -> 'ru'
      if (availableLanguages.includes(langCode as SupportedLanguage)) {
        currentLanguage.value = langCode as SupportedLanguage
        return
      }
    }

    // Проверяем язык браузера
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase().split('-')[0]
      if (availableLanguages.includes(browserLang as SupportedLanguage)) {
        currentLanguage.value = browserLang as SupportedLanguage
        return
      }
    }

    // По умолчанию русский
    currentLanguage.value = 'ru'
  }

  // Получить название языка
  const getLanguageName = (lang: SupportedLanguage): string => {
    return translations[lang]?.language?.russian || lang
  }

  // Получить нативное название языка
  const getNativeLanguageName = (lang: SupportedLanguage): string => {
    const langNames: Record<SupportedLanguage, string> = {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      kk: 'Қазақ',
      de: 'Deutsch',
      fr: 'Français',
      fi: 'Suomi',
      sv: 'Svenska'
    }
    return langNames[lang] || lang
  }

  // Получить все языки с названиями
  const getLanguagesList = () => {
    return availableLanguages.map(lang => ({
      code: lang,
      name: getLanguageName(lang),
      nativeName: getNativeLanguageName(lang)
    }))
  }

  // Восстановление языка из localStorage при инициализации
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app_language') as SupportedLanguage
    if (saved && availableLanguages.includes(saved)) {
      currentLanguage.value = saved
    }
  }

  return {
    // Состояние
    currentLanguage,
    availableLanguages,
    
    // Геттеры
    t,
    
    // Действия
    setLanguage,
    initLanguage,
    getLanguageName,
    getLanguagesList
  }
})

