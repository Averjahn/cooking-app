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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
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
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
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
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.language-menu-header span {
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #e2e8f0;
  color: #1a202c;
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: #1a202c;
  font-size: 0.9rem;
}

.language-item:hover {
  background: #f7fafc;
}

.language-item--active {
  background: #edf2f7;
  font-weight: 600;
}

.language-name {
  flex: 1;
}

.language-check {
  color: #48bb78;
  font-weight: 700;
  font-size: 1.2rem;
  margin-left: 0.5rem;
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

