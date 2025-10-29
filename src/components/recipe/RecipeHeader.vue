<!--
  Компонент заголовка рецепта
  Отображает название рецепта и индикатор текущего шага
-->

<script setup lang="ts">
import type { Recipe } from '../../types/recipes'
import { useI18n } from '../../composables/useI18n'

interface Props {
  /** Рецепт для отображения */
  recipe: Recipe
  /** Индекс текущего шага (начиная с 0) */
  currentStepIndex: number
  /** Показывать ли кнопку возврата */
  showBackButton?: boolean
}

interface Emits {
  /** Событие возврата к списку рецептов */
  (e: 'back-to-recipes'): void
}

import { computed } from 'vue'

// Определяем пропсы и события

const props = withDefaults(defineProps<Props>(), {
  showBackButton: true
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

/**
 * Обработчик нажатия кнопки "Назад"
 */
const handleBackClick = (): void => {
  emit('back-to-recipes')
}

/**
 * Вычисляет процент завершения рецепта
 */
const completionPercentage = computed(() => {
  if (props.recipe.steps.length === 0) return 0
  return Math.round((props.currentStepIndex / props.recipe.steps.length) * 100)
})
</script>

<template>
  <div class="recipe-header">
    <!-- Кнопка выхода -->
    <div v-if="showBackButton" class="exit-section">
      <button @click="handleBackClick" class="exit-button">
        {{ t('recipe.backToRecipes') }}
      </button>
    </div>

    <!-- Основной заголовок -->
    <div class="header-content">
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      
      <!-- Индикатор шага -->
      <div class="step-indicator">
        <span class="step-text">
          {{ t('recipe.step') }} {{ currentStepIndex + 1 }} {{ t('recipe.of') }} {{ recipe.steps.length }}
        </span>
        
        <!-- Прогресс бар -->
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ completionPercentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Контейнер заголовка */
.recipe-header {
  margin-bottom: 1.5rem;
}

/* Секция выхода */
.exit-section {
  text-align: center;
  margin: 2rem 0 1rem 0;
}

.exit-button {
  background: #3d2817;
  color: #f5ebe0;
  border: 2px solid #3d2817;
  padding: 0.5rem 1rem;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
}

.exit-button:hover {
  background: #523825;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(61, 40, 23, 0.6);
}

/* Основной контент */
.header-content {
  text-align: center;
}

.recipe-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5ebe0;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 0 rgba(61, 40, 23, 0.8);
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
}

/* Индикатор шага */
.step-indicator {
  background: #f5ebe0;
  border-radius: 0;
  padding: 0.8rem 1.2rem;
  backdrop-filter: none;
  border: 3px solid #3d2817;
  box-shadow: 4px 4px 0 rgba(61, 40, 23, 0.6);
  position: relative;
}

/* Текстура для индикатора */
.step-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.05) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
}

.step-indicator > * {
  position: relative;
  z-index: 1;
}

.step-text {
  color: #3d2817;
  font-size: 0.9rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Прогресс */
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(61, 40, 23, 0.2);
  border-radius: 0;
  overflow: hidden;
  border: 2px solid #3d2817;
}

.progress-fill {
  height: 100%;
  background: #3d2817;
  border-radius: 0;
  transition: width 0.3s ease;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.3);
}

.progress-text {
  color: #3d2817;
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 40px;
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* Адаптивность */
@media (max-width: 480px) {
  .recipe-title {
    font-size: 1.5rem;
  }
  
  .step-indicator {
    padding: 0.6rem 1rem;
  }
  
  .step-text {
    font-size: 0.85rem;
  }
}
</style>
