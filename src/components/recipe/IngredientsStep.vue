<!--
  Компонент для отображения шага с ингредиентами
  Показывает сетку ингредиентов с иконками и названиями
-->

<script setup lang="ts">
import type { RecipeStep } from '../../types/recipes'
import { useI18n } from '../../composables/useI18n'

interface Props {
  /** Шаг рецепта с ингредиентами */
  step: RecipeStep
}

interface Emits {
  /** Событие нажатия на кнопку действия */
  (e: 'action-click', action: string): void
}

import { computed } from 'vue'

// Определяем пропсы и события

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

/**
 * Обработчик нажатия на кнопку
 */

const handleActionClick = (action: string): void => {
  emit('action-click', action)
}

/**
 * Проверяет, есть ли ингредиенты для отображения
 */
const hasIngredients = computed(() => {
  return props.step.ingredients && props.step.ingredients.length > 0
})
</script>

<template>
  <div class="ingredients-step">
    <!-- Заголовок шага -->
    <h3 class="step-title">{{ step.text }}</h3>
    
    <!-- Сетка ингредиентов -->
    <div v-if="hasIngredients" class="ingredients-grid">
      <div 
        v-for="ingredient in step.ingredients" 
        :key="ingredient.name"
        class="ingredient-item"
      >
        <div class="ingredient-icon">{{ ingredient.icon }}</div>
        <span class="ingredient-name">{{ ingredient.name }}</span>
      </div>
    </div>
    
    <!-- Сообщение об отсутствии ингредиентов -->
    <div v-else class="no-ingredients">
      <p>{{ t('recipe.ingredientsNotSpecified') }}</p>
    </div>
    
    <!-- Кнопки действий -->
    <div v-if="step.buttons.length > 0" class="action-buttons">
      <button
        v-for="button in step.buttons"
        :key="button"
        @click="handleActionClick(button)"
        class="action-button"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Контейнер шага */
.ingredients-step {
  width: 100%;
}

/* Заголовок */
.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
  text-align: center;
}

/* Сетка ингредиентов */
.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.ingredient-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0.5rem;
  background: #f5ebe0;
  border-radius: 0;
  border: 2px solid #3d2817;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
}

.ingredient-item:hover {
  background: rgba(61, 40, 23, 0.1);
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
}

.ingredient-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.ingredient-name {
  font-weight: 700;
  color: #3d2817;
  font-size: 0.85rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Сообщение об отсутствии ингредиентов */
.no-ingredients {
  text-align: center;
  padding: 2rem;
  color: #3d2817;
  font-style: normal;
  background: #f5ebe0;
  border: 2px solid #3d2817;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.no-ingredients p {
  margin: 0;
}

/* Кнопки действий */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.action-button {
  background: #3d2817;
  color: #f5ebe0;
  border: 2px solid #3d2817;
  padding: 0.6rem 1.2rem;
  border-radius: 0;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  min-width: 100px;
  text-align: center;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
}

.action-button:hover {
  background: #523825;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(61, 40, 23, 0.6);
}

.action-button:active {
  transform: translateY(0);
}

/* Адаптивность */
@media (max-width: 480px) {
  .ingredients-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }
  
  .ingredient-item {
    padding: 0.75rem 0.25rem;
  }
  
  .ingredient-icon {
    font-size: 2rem;
  }
  
  .ingredient-name {
    font-size: 0.8rem;
  }
  
  .action-button {
    min-width: 80px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

/* Анимации */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ingredients-step {
  animation: slideIn 0.3s ease-out;
}
</style>
