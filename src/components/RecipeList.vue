<script setup lang="ts">
import { useRecipesStore } from '../stores/recipes'
import { useI18n } from '../composables/useI18n'
import type { AnyRecipe } from '../types/recipes'

const recipesStore = useRecipesStore()
const { t, pluralize } = useI18n()

const selectRecipe = (recipe: AnyRecipe) => {
  recipesStore.setAnyRecipe(recipe)
}

// Функция для правильного склонения слова "шаг"
const getStepText = (count: number): string => {
  return pluralize(count, t('recipes.steps'), t('recipes.steps2'), t('recipes.steps5'))
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
    return `${minutes} ${t('recipes.minutes')}`
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
    return pluralize(count, t('recipes.blocks'), t('recipes.blocks2'), t('recipes.blocks5'))
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
  height: calc(100vh - (70px + var(--safe-bottom)));
  overflow-y: auto;
  overflow-x: hidden;
  background: #f5ebe0;
  padding-top: calc(120px + var(--safe-top));
  padding-bottom: 4rem;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
  position: relative;
}

/* Текстура для списка рецептов */
.recipe-list::before {
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
  background: #f5ebe0;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 4px solid #3d2817;
  position: relative;
  z-index: 1;
}

/* Текстура для карточки */
.recipe-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.05) 1px, transparent 1px);
  background-size: 3px 3px;
  pointer-events: none;
  z-index: 0;
}

.recipe-card > * {
  position: relative;
  z-index: 1;
}

.recipe-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 rgba(61, 40, 23, 0.6);
}

.recipe-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #3d2817;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 4px solid #3d2817;
  position: relative;
}

/* Текстура для изображения */
.recipe-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(245, 235, 224, 0.05) 2px,
      rgba(245, 235, 224, 0.05) 4px
    );
}

.recipe-image-content {
  font-size: 4rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  filter: grayscale(20%) contrast(110%);
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
  color: #3d2817;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.recipe-description {
  color: #3d2817;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  opacity: 0.9;
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
  background: #f5ebe0;
  color: #3d2817;
  padding: 0.5rem 1rem;
  border-radius: 0;
  font-size: 0.85rem;
  font-weight: 700;
  border: 2px solid #3d2817;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.recipe-difficulty {
  background: #3d2817;
  color: #f5ebe0;
  font-size: 0.75rem;
  border: 2px solid #3d2817;
}
</style>
