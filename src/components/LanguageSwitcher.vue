<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useI18n } from '../composables/useI18n'

const languageStore = useLanguageStore()
const { t, setLanguage } = useI18n()

// Состояние открытия меню
const isOpen = ref(false)

// Получаем список языков
const languages = computed(() => languageStore.getLanguagesList())

// Текущий язык
const currentLang = computed(() => languageStore.currentLanguage)

// Обработчик выбора языка
const handleLanguageSelect = (langCode: string) => {
  setLanguage(langCode as any)
  isOpen.value = false
  
  // Тактильная обратная связь через Telegram WebApp
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    } catch (e) {
      // Игнорируем ошибки
    }
  }
}

// Переключение открытия/закрытия меню
const toggleMenu = () => {
  isOpen.value = !isOpen.value
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    } catch (e) {
      // Игнорируем ошибки
    }
  }
}

// Закрытие меню при клике вне компонента
const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="language-switcher">
    <!-- Кнопка переключения языка -->
    <button 
      @click="toggleMenu" 
      class="language-button"
      :aria-label="t('language.select')"
    >
      <span class="language-icon">🌐</span>
      <span class="language-code">{{ currentLang.toUpperCase() }}</span>
    </button>

    <!-- Выпадающее меню -->
    <div v-if="isOpen" class="language-menu" @click.stop>
      <div class="language-menu-header">
        <span>{{ t('language.select') }}</span>
        <button @click="closeMenu" class="close-button">×</button>
      </div>
      <div class="language-list">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="handleLanguageSelect(lang.code)"
          :class="['language-item', { 'language-item--active': lang.code === currentLang }]"
        >
          <span class="language-name">{{ lang.nativeName }}</span>
          <span v-if="lang.code === currentLang" class="language-check">✓</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3d2817;
  border: 2px solid #3d2817;
  border-radius: 0;
  color: #f5ebe0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 100;
  position: relative;
  box-shadow: 4px 4px 0 rgba(61, 40, 23, 0.6);
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

/* Текстура для кнопки */
.language-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    radial-gradient(circle, rgba(245, 235, 224, 0.1) 1px, transparent 1px);
  background-size: 3px 3px;
  pointer-events: none;
}

.language-button:hover {
  background: #523825;
  border-color: #523825;
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 rgba(61, 40, 23, 0.6);
}

.language-icon {
  font-size: 1.2rem;
}

.language-code {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Выпадающее меню */
.language-menu {
  position: absolute;
  top: calc(100% + 0.5rem + var(--safe-top));
  right: 0;
  background: #f5ebe0;
  border: 3px solid #3d2817;
  border-radius: 0;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  min-width: 200px;
  z-index: 1001;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  position: relative;
}

/* Текстура для меню */
.language-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.05) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
  z-index: 0;
}

.language-menu > * {
  position: relative;
  z-index: 1;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.language-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 3px solid #3d2817;
  background: #f5ebe0;
  font-family: 'Courier New', monospace;
}

.language-menu-header span {
  font-weight: 700;
  color: #3d2817;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #3d2817;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.2s ease;
  font-weight: 700;
}

.close-button:hover {
  background: rgba(61, 40, 23, 0.1);
  color: #3d2817;
}

.language-list {
  padding: 0.5rem;
}

.language-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: #3d2817;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.language-item:hover {
  background: rgba(61, 40, 23, 0.1);
}

.language-item--active {
  background: #3d2817;
  color: #f5ebe0;
  font-weight: 700;
}

.language-name {
  flex: 1;
}

.language-check {
  color: #3d2817;
  font-weight: 700;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.language-item--active .language-check {
  color: #f5ebe0;
}

/* Адаптивность */
@media (max-width: 480px) {
  .language-menu {
    right: -10px;
    min-width: 180px;
  }
  
  .language-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>

