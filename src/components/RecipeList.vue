<script setup lang="ts">
import { useRecipesStore } from '../stores/recipes'
import type { AnyRecipe } from '../types/recipes'

const recipesStore = useRecipesStore()

const selectRecipe = (recipe: AnyRecipe) => {
  recipesStore.setAnyRecipe(recipe)
}

// Функция для правильного склонения слова "шаг"
const getStepText = (count: number): string => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'шагов'
  }

  switch (lastDigit) {
    case 1:
      return 'шаг'
    case 2:
    case 3:
    case 4:
      return 'шага'
    default:
      return 'шагов'
  }
}

// Функция для подсчета общего времени приготовления
const getTotalTime = (recipe: AnyRecipe): string => {
  if ('blocks' in recipe) {
    // Мульти-блочный рецепт - возвращаем totalTime
    return recipe.totalTime
  } else {
    // Обычный рецепт - считаем по шагам
    const minutes = recipe.steps.reduce((total, step) => {
      if (step.timer) {
        return total + Math.ceil(step.timer / 60)
      }
      return total
    }, 0)
    return `${minutes} мин`
  }
}

// Функция для подсчета количества шагов/блоков
const getStepsCount = (recipe: AnyRecipe): number => {
  if ('blocks' in recipe) {
    return recipe.blocks.length
  } else {
    return recipe.steps.length
  }
}

// Функция для получения правильного текста (шаг/блок)
const getStepLabel = (recipe: AnyRecipe, count: number): string => {
  if ('blocks' in recipe) {
    // Для мульти-блочных рецептов используем "блок"
    const lastDigit = count % 10
    const lastTwoDigits = count % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'блоков'
    }

    switch (lastDigit) {
      case 1:
        return 'блок'
      case 2:
      case 3:
      case 4:
        return 'блока'
      default:
        return 'блоков'
    }
  } else {
    // Для обычных рецептов используем существующую функцию
    return getStepText(count)
  }
}
</script>

<template>
  <div class="recipe-list">
    <div class="recipe-grid">
      <div 
        v-for="recipe in recipesStore.allRecipesUnified" 
        :key="recipe.id"
        class="recipe-card"
        @click="selectRecipe(recipe)"
      >
        <div class="recipe-image">
          <!-- Если image это URL картинки -->
          <img 
            v-if="recipe.image.startsWith('http')" 
            :src="recipe.image" 
            :alt="recipe.title" 
          />
          <!-- Если image это эмодзи -->
          <div 
            v-else 
            class="recipe-image-content"
          >
            {{ recipe.image }}
          </div>
        </div>
        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-stats">
            <span class="recipe-steps">{{ getStepsCount(recipe) }} {{ getStepLabel(recipe, getStepsCount(recipe)) }}</span>
            <span class="recipe-time">{{ getTotalTime(recipe) }}</span>
            <span v-if="'difficulty' in recipe" class="recipe-difficulty">{{ recipe.difficulty }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-list {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 150px;
  padding-bottom: 4rem;
  box-sizing: border-box;
}

/* Простая стилизация скроллбара */
.recipe-list::-webkit-scrollbar {
  width: 6px;
}

.recipe-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
}

.recipe-grid {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.recipe-grid > * + * {
  margin-top: 2rem;
}

.recipe-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image-content {
  font-size: 4rem;
  text-align: center;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image img {
  transform: scale(1.05);
}

.recipe-content {
  padding: 1.5rem;
}

.recipe-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.recipe-description {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.recipe-steps,
.recipe-time,
.recipe-difficulty {
  background: #f7fafc;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

.recipe-difficulty {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
