import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { coffeeRecipes } from '../recipes/coffeeRecipes'
import type { Recipe, MultiTaskRecipe, AnyRecipe } from '../types/recipes'
import { fetchCoffeeImage } from '../utils/imageProvider'
import { useLanguageStore } from './language'
import { fetchCoffeeRecipesFromApi } from '../api/coffee'

export const useRecipesStore = defineStore('recipes', () => {
  const languageStore = useLanguageStore()
  // Состояние для кофейных рецептов
  const allRecipes = ref<Recipe[]>(coffeeRecipes)
  const currentRecipe = ref<Recipe | null>(null)
  const currentStepIndex = ref(0)

  // Состояние для новых мульти-блочных рецептов
  const allMultiTaskRecipes = ref<MultiTaskRecipe[]>([])
  const currentMultiTaskRecipe = ref<MultiTaskRecipe | null>(null)
  const currentBlockId = ref<string | null>(null)
  const currentBlockStepIndex = ref(0)
  const completedBlocks = ref<Set<string>>(new Set())

  // Геттеры для старых рецептов
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

  // Геттеры для новых мульти-блочных рецептов
  const currentBlock = computed(() => {
    if (!currentMultiTaskRecipe.value || !currentBlockId.value) return null
    return currentMultiTaskRecipe.value.blocks.find(block => block.id === currentBlockId.value)
  })
  
  const currentBlockStep = computed(() => {
    if (!currentBlock.value) return null
    return currentBlock.value.steps[currentBlockStepIndex.value]
  })
  
  const isLastBlockStep = computed(() => {
    if (!currentBlock.value) return true
    return currentBlockStepIndex.value === currentBlock.value.steps.length - 1
  })
  
  const isFirstBlockStep = computed(() => currentBlockStepIndex.value === 0)
  
  const availableBlocks = computed(() => {
    if (!currentMultiTaskRecipe.value) return []
    return currentMultiTaskRecipe.value.blocks.filter(block => {
      // Если блок можно запустить сразу
      if (block.canStartImmediately) return true
      
      // Если нет зависимостей
      if (!block.canStartWhen || block.canStartWhen.length === 0) return true
      
      // Проверяем зависимости
      if (block.requiresAllBlocks) {
        // Нужны ВСЕ зависимости
        return block.canStartWhen.every(blockId => completedBlocks.value.has(blockId))
      } else {
        // Достаточно ЛЮБОЙ зависимости
        return block.canStartWhen.some(blockId => completedBlocks.value.has(blockId))
      }
    })
  })

  // Объединенный список всех рецептов
  const allRecipesUnified = computed(() => [
    ...allRecipes.value,
    ...allMultiTaskRecipes.value
  ])

  // Обогащение картинок через Pixabay (если указан ключ)
  const enrichImages = async () => {
    const lang = languageStore.currentLanguage
    const updated: Recipe[] = []
    for (const r of allRecipes.value) {
      if (typeof r.image === 'string' && !r.image.startsWith('http')) {
        const img = await fetchCoffeeImage(r.title, lang)
        updated.push({ ...r, image: img || r.image })
      } else {
        updated.push(r)
      }
    }
    allRecipes.value = updated
  }

  // Загрузка рецептов из внешнего API (SampleAPIs) с автопереводом
  const loadFromApi = async () => {
    const external = await fetchCoffeeRecipesFromApi()
    if (external && external.length > 0) {
      allRecipes.value = external
    }
  }

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

  const getRecipeById = (id: number): Recipe | undefined => {
    return allRecipes.value.find(recipe => recipe.id === id)
  }

  // Новые методы для мульти-блочных рецептов
  const setCurrentMultiTaskRecipe = (recipe: MultiTaskRecipe | null) => {
    currentMultiTaskRecipe.value = recipe
    currentBlockId.value = null
    currentBlockStepIndex.value = 0
    completedBlocks.value.clear()
  }

  const setCurrentBlock = (blockId: string) => {
    currentBlockId.value = blockId
    currentBlockStepIndex.value = 0
  }

  const nextBlockStep = () => {
    if (currentBlock.value && !isLastBlockStep.value) {
      currentBlockStepIndex.value++
    }
  }

  const previousBlockStep = () => {
    if (!isFirstBlockStep.value) {
      currentBlockStepIndex.value--
    }
  }

  const completeBlock = (blockId: string) => {
    completedBlocks.value.add(blockId)
  }

  const resetMultiTaskRecipe = () => {
    currentBlockId.value = null
    currentBlockStepIndex.value = 0
    completedBlocks.value.clear()
  }

  const getMultiTaskRecipeById = (id: number): MultiTaskRecipe | undefined => {
    return allMultiTaskRecipes.value.find(recipe => recipe.id === id)
  }

  // Универсальные методы
  const setAnyRecipe = (recipe: AnyRecipe | null) => {
    if (!recipe) {
      currentRecipe.value = null
      currentMultiTaskRecipe.value = null
      return
    }

    if ('blocks' in recipe) {
      // Это MultiTaskRecipe
      setCurrentMultiTaskRecipe(recipe)
      currentRecipe.value = null
    } else {
      // Это обычный Recipe
      setCurrentRecipe(recipe)
      currentMultiTaskRecipe.value = null
    }
  }

  const getCurrentRecipeType = computed(() => {
    if (currentMultiTaskRecipe.value) return 'multi-task'
    if (currentRecipe.value) return 'simple'
    return null
  })

  return {
    // Состояние для старых рецептов
    allRecipes,
    currentRecipe,
    currentStepIndex,
    
    // Состояние для новых рецептов
    allMultiTaskRecipes,
    currentMultiTaskRecipe,
    currentBlockId,
    currentBlockStepIndex,
    completedBlocks,
    
    // Геттеры для старых рецептов
    recipesCount,
    currentStep,
    isLastStep,
    isFirstStep,
    
    // Геттеры для новых рецептов
    currentBlock,
    currentBlockStep,
    isLastBlockStep,
    isFirstBlockStep,
    availableBlocks,
    allRecipesUnified,
    getCurrentRecipeType,
    
    // Действия для старых рецептов
    setCurrentRecipe,
    nextStep,
    previousStep,
    goToStep,
    resetRecipe,
    getRecipeById,
    
    // Действия для новых рецептов
    setCurrentMultiTaskRecipe,
    setCurrentBlock,
    nextBlockStep,
    previousBlockStep,
    completeBlock,
    resetMultiTaskRecipe,
    getMultiTaskRecipeById,
    setAnyRecipe,
    enrichImages,
    loadFromApi
  }
})
