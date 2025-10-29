<!--
  Компонент навигации по шагам рецепта
  Управляет переходами между шагами и отображением кнопок
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../../composables/useI18n'

interface Props {
  /** Можно ли перейти к предыдущему шагу */
  canGoPrevious: boolean
  /** Можно ли перейти к следующему шагу */
  canGoNext: boolean
  /** Показывать ли кнопку "Далее" */
  showNextButton: boolean
  /** Текст кнопки "Далее" */
  nextButtonText?: string
  /** Текст кнопки "Назад" */
  previousButtonText?: string
  /** Отключена ли кнопка "Далее" */
  nextDisabled?: boolean
}

interface Emits {
  /** Переход к предыдущему шагу */
  (e: 'previous'): void
  /** Переход к следующему шагу */
  (e: 'next'): void
}

const { t } = useI18n()

// Определяем пропсы с значениями по умолчанию
const props = withDefaults(defineProps<Props>(), {
  nextButtonText: computed(() => `${t('common.next')} →`).value,
  previousButtonText: computed(() => `← ${t('common.back')}`).value,
  nextDisabled: false
})

const emit = defineEmits<Emits>()

// Вычисляемые значения для текстов кнопок
const nextText = computed(() => props.nextButtonText || `${t('common.next')} →`)
const previousText = computed(() => props.previousButtonText || `← ${t('common.back')}`)

/**
 * Обработчик нажатия кнопки "Назад"
 */
const handlePrevious = (): void => {
  if (props.canGoPrevious) {
    emit('previous')
  }
}

/**
 * Обработчик нажатия кнопки "Далее"
 */
const handleNext = (): void => {
  if (props.canGoNext && !props.nextDisabled) {
    emit('next')
  }
}

/**
 * CSS классы для кнопки "Далее"
 */
const nextButtonClasses = computed(() => {
  return [
    'nav-button',
    'nav-button--next',
    {
      'nav-button--disabled': props.nextDisabled || !props.canGoNext
    }
  ]
})

/**
 * CSS классы для кнопки "Назад"
 */
const previousButtonClasses = computed(() => {
  return [
    'nav-button',
    'nav-button--previous',
    {
      'nav-button--disabled': !props.canGoPrevious
    }
  ]
})
</script>

<template>
  <div class="step-navigation">
    <!-- Кнопка "Назад" -->
    <button 
      v-if="canGoPrevious"
      :class="previousButtonClasses"
      @click="handlePrevious"
      :disabled="!canGoPrevious"
    >
      {{ previousText }}
    </button>
    
    <!-- Пустое место если нельзя идти назад -->
    <div v-else class="nav-spacer"></div>
    
    <!-- Кнопка "Далее" -->
    <button 
      v-if="showNextButton"
      :class="nextButtonClasses"
      @click="handleNext"
      :disabled="nextDisabled || !canGoNext"
    >
      {{ nextText }}
    </button>
    
    <!-- Пустое место если нет кнопки "Далее" -->
    <div v-else class="nav-spacer"></div>
  </div>
</template>

<style scoped>
/* Контейнер навигации */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  width: 100%;
  border-top: 1px solid #e2e8f0;
}

/* Пустое место для выравнивания */
.nav-spacer {
  min-width: 100px;
}

/* Базовые стили кнопок */
.nav-button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  min-width: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Кнопка "Назад" */
.nav-button--previous {
  background: #667eea;
  color: white;
}

.nav-button--previous:hover:not(.nav-button--disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* Кнопка "Далее" */
.nav-button--next {
  background: #48bb78;
  color: white;
}

.nav-button--next:hover:not(.nav-button--disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}

/* Отключенное состояние */
.nav-button--disabled {
  background: #a0aec0 !important;
  color: #718096 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Активное состояние (нажатие) */
.nav-button:active:not(.nav-button--disabled) {
  transform: translateY(0);
}

/* Фокус для доступности */
.nav-button:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .step-navigation {
    margin-top: 1rem;
    padding-top: 0.75rem;
  }
}

@media (max-width: 480px) {
  .nav-button {
    min-width: 80px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .nav-spacer {
    min-width: 80px;
  }
  
  .step-navigation {
    gap: 0.5rem;
  }
}

/* Анимации */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-navigation {
  animation: slideUp 0.3s ease-out;
}

/* Эффект появления кнопок */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.nav-button {
  animation: fadeIn 0.3s ease-out;
}

/* Улучшенная доступность */
@media (prefers-reduced-motion: reduce) {
  .nav-button {
    transition: none;
    animation: none;
  }
  
  .step-navigation {
    animation: none;
  }
}

/* Высокий контраст */
@media (prefers-contrast: high) {
  .nav-button--previous {
    border: 2px solid #000;
  }
  
  .nav-button--next {
    border: 2px solid #000;
  }
  
  .step-navigation {
    border-top-color: #000;
  }
}
</style>
