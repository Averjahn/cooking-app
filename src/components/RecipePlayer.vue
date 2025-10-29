<!--
  Компонент воспроизведения рецепта
  Управляет пошаговым выполнением рецепта
-->

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes'
import type { Recipe } from '../types/recipes'
import { useSimpleTimer } from '../composables/useSimpleTimer'
import { useI18n } from '../composables/useI18n'

// Импорт компонентов
import RecipeHeader from './recipe/RecipeHeader.vue'
import IngredientsStep from './recipe/IngredientsStep.vue'
import ActionStep from './recipe/ActionStep.vue'
import ParallelStep from './recipe/ParallelStep.vue'
import StepNavigation from './recipe/StepNavigation.vue'

interface Props {
  /** Рецепт для воспроизведения */
  recipe: Recipe
}

const props = defineProps<Props>()

// Используем хранилище рецептов
const recipesStore = useRecipesStore()
const { t } = useI18n()

// Используем композабл для параллельных таймеров
const { reset: resetParallelTimers } = useSimpleTimer()

// Состояние завершенности параллельных шагов
const parallelStepsCompleted = ref(false)

/**
 * Текущий шаг рецепта
 */
const currentStep = computed(() => {
  if (recipesStore.currentStepIndex < props.recipe.steps.length) {
    return props.recipe.steps[recipesStore.currentStepIndex]
  }
  return null
})

/**
 * Проверяет, является ли текущий шаг параллельным
 */
const isParallelStep = computed(() => currentStep.value?.type === 'parallel')

/**
 * Проверяет, завершены ли все параллельные шаги
 */
const allParallelStepsCompleted = computed(() => {
  if (!isParallelStep.value || !currentStep.value) return false
  return parallelStepsCompleted.value
})

/**
 * Проверяет, можно ли перейти к предыдущему шагу
 */
const canGoPrevious = computed(() => !recipesStore.isFirstStep)

/**
 * Проверяет, можно ли перейти к следующему шагу
 */
const canGoNext = computed(() => {
  if (isParallelStep.value) {
    return allParallelStepsCompleted.value
  }
  return !recipesStore.isLastStep
})

/**
 * Определяет, показывать ли кнопку "Далее"
 */
const showNextButton = computed(() => {
  if (recipesStore.isLastStep) return false
  // Для параллельных шагов показываем кнопку "Далее" только когда все завершены
  if (isParallelStep.value) return allParallelStepsCompleted.value
  return false // Для обычных шагов кнопка "Далее" встроена в ActionStep
})

/**
 * Проверяет, завершен ли рецепт
 */
const isRecipeCompleted = computed(() => {
  return recipesStore.currentStepIndex >= props.recipe.steps.length
})

/**
 * Обработчик возврата к списку рецептов
 */
const handleBackToRecipes = (): void => {
  resetParallelTimers()
  recipesStore.setCurrentRecipe(null)
}

/**
 * Обработчик перехода к следующему шагу
 */
const handleNextStep = (): void => {
  resetParallelTimers()
  parallelStepsCompleted.value = false
  recipesStore.nextStep()
}

/**
 * Обработчик перехода к предыдущему шагу
 */
const handlePreviousStep = (): void => {
  resetParallelTimers()
  parallelStepsCompleted.value = false
  recipesStore.previousStep()
}

/**
 * Обработчик нажатия на кнопку действия
 */
const handleActionClick = (): void => {
  // Для непараллельных шагов автоматически переходим к следующему
  if (!isParallelStep.value) {
    handleNextStep()
  }
}

/**
 * Обработчик завершения всех параллельных действий
 */
const handleAllParallelCompleted = (): void => {
  parallelStepsCompleted.value = true
}

/**
 * Обработчик завершения таймера
 */
const handleTimerFinished = (): void => {
  // Можно добавить дополнительную логику если нужно
}

// Очистка при размонтировании
onUnmounted(() => {
  resetParallelTimers()
})
</script>

<template>
  <div class="recipe-player">
    <!-- Заголовок рецепта -->
    <RecipeHeader
      :recipe="recipe"
      :current-step-index="recipesStore.currentStepIndex"
      @back-to-recipes="handleBackToRecipes"
    />

    <!-- Контейнер текущего шага -->
    <div class="step-container">
      <!-- Рецепт завершен -->
      <div v-if="isRecipeCompleted" class="recipe-complete">
        <div class="complete-icon">🎉</div>
        <h3>{{ t('recipe.completed') }}</h3>
        <p>{{ t('recipe.completedMessage') }} {{ recipe.title }}</p>
        <button @click="handleBackToRecipes" class="complete-button">
          {{ t('recipe.backToRecipes') }}
        </button>
      </div>

      <!-- Текущий шаг -->
      <div v-else-if="currentStep" class="step-content">
        <!-- Шаг с ингредиентами -->
        <IngredientsStep
          v-if="currentStep.type === 'ingredients'"
          :step="currentStep"
          @action-click="handleActionClick"
        />

        <!-- Параллельный шаг -->
        <ParallelStep
          v-else-if="currentStep.type === 'parallel'"
          :step="currentStep"
          @all-completed="handleAllParallelCompleted"
        />

        <!-- Обычный шаг с действием -->
        <ActionStep
          v-else
          :step="currentStep"
          @action-click="handleActionClick"
          @timer-finished="handleTimerFinished"
        />

        <!-- Навигация по шагам -->
        <StepNavigation
          :can-go-previous="canGoPrevious"
          :can-go-next="canGoNext"
          :show-next-button="showNextButton"
          @previous="handlePreviousStep"
          @next="handleNextStep"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Основной контейнер */
.recipe-player {
  width: 100dvw;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background: #f5ebe0;
  min-height: calc(100vh - 70px);
}

/* Контент шага - Винтажный стиль */
.step-content {
  background: #f5ebe0;
  border-radius: 0;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  border: 4px solid #3d2817;
  font-family: 'Courier New', monospace;
  position: relative;
}

/* Текстура для шага */
.step-content::before {
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
  z-index: 0;
}

.step-content > * {
  position: relative;
  z-index: 1;
}

/* Завершение рецепта */
.recipe-complete {
  text-align: center;
  background: #f5ebe0;
  border-radius: 0;
  padding: 2rem;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  border: 4px solid #3d2817;
  font-family: 'Courier New', monospace;
  position: relative;
}

/* Текстура для завершения */
.recipe-complete::before {
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
  z-index: 0;
}

.recipe-complete > * {
  position: relative;
  z-index: 1;
}

.complete-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.recipe-complete h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d2817;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.recipe-complete p {
  color: #3d2817;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
  font-weight: 600;
}

.complete-button {
  background: #3d2817;
  color: #f5ebe0;
  border: 2px solid #3d2817;
  padding: 0.8rem 1.5rem;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
}

.complete-button:hover {
  background: #333;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
}

/* Адаптивность */
@media (max-width: 480px) {
  .recipe-player {
    padding: 0.75rem;
  }
  
  .step-content {
    padding: 1.25rem;
  }
}
</style>
