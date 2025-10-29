import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeName = 'classic' | 'coffee'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeName>('coffee')

  const setTheme = (theme: ThemeName) => {
    currentTheme.value = theme
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_theme', theme)
    }
  }

  const initTheme = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme') as ThemeName
      if (saved === 'classic' || saved === 'coffee') {
        currentTheme.value = saved
      }
    }
  }

  const themeClass = computed(() => `theme-${currentTheme.value}`)

  // Автоинициализация
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app_theme') as ThemeName
    if (saved === 'classic' || saved === 'coffee') {
      currentTheme.value = saved
    }
  }

  return { currentTheme, setTheme, initTheme, themeClass }
})


