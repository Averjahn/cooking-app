import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipes } from '../recipes/recipes'
import type { Recipe } from '../types/recipes'

export const useRecipesStore = defineStore('recipes', () => {
  // Состояние
  const allRecipes = ref<Recipe[]>(recipes)
  const currentRecipe = ref<Recipe | null>(null)
  const currentStepIndex = ref(0)

  // Геттеры
  const recipesCount = computed(() => allRecipes.value.length)
  const currentStep = computed(() => {
    if (!currentRecipe.value) return null
    return currentRecipe.value.steps[currentStepIndex.value]
  })
  const isLastStep = computed(() => {
    if (!currentRecipe.value) return true
    return currentStepIndex.value === currentRecipe.value.steps.length - 1
  })
  const isFirstStep = computed(() => currentStepIndex.value === 0)

  // Действия
  const setCurrentRecipe = (recipe: Recipe | null) => {
    currentRecipe.value = recipe
    currentStepIndex.value = 0
  }

  const nextStep = () => {
    if (currentRecipe.value && !isLastStep.value) {
      currentStepIndex.value++
    }
  }

  const previousStep = () => {
    if (!isFirstStep.value) {
      currentStepIndex.value--
    }
  }

  const goToStep = (stepIndex: number) => {
    if (currentRecipe.value && stepIndex >= 0 && stepIndex < currentRecipe.value.steps.length) {
      currentStepIndex.value = stepIndex
    }
  }

  const resetRecipe = () => {
    currentStepIndex.value = 0
  }

  const getRecipeById = (id: string): Recipe | undefined => {
    return allRecipes.value.find(recipe => recipe.id === id)
  }

  return {
    // Состояние
    allRecipes,
    currentRecipe,
    currentStepIndex,
    
    // Геттеры
    recipesCount,
    currentStep,
    isLastStep,
    isFirstStep,
    
    // Действия
    setCurrentRecipe,
    nextStep,
    previousStep,
    goToStep,
    resetRecipe,
    getRecipeById
  }
})
