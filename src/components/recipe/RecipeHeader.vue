<!--
  Компонент заголовка рецепта
  Отображает название рецепта и индикатор текущего шага
-->

<script setup lang="ts">
import type { Recipe } from '../../types/recipes'

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
        ← Назад к рецептам
      </button>
    </div>

    <!-- Основной заголовок -->
    <div class="header-content">
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      
      <!-- Индикатор шага -->
      <div class="step-indicator">
        <span class="step-text">
          Шаг {{ currentStepIndex + 1 }} из {{ recipe.steps.length }}
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
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.exit-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Основной контент */
.header-content {
  text-align: center;
}

.recipe-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

/* Индикатор шага */
.step-indicator {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 0.8rem 1.2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
}

/* Прогресс */
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
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
