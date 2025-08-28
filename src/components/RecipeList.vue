<script setup lang="ts">
import { useRecipesStore } from '../stores/recipes'
import type { Recipe } from '../types/recipes'

const recipesStore = useRecipesStore()

const selectRecipe = (recipe: Recipe) => {
  recipesStore.setCurrentRecipe(recipe)
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
const getTotalTime = (recipe: Recipe): number => {
  return recipe.steps.reduce((total, step) => {
    if (step.timer) {
      return total + Math.ceil(step.timer / 60)
    }
    return total
  }, 0)
}
</script>

<template>
  <div class="recipe-list">
    <div class="recipe-grid">
      <div 
        v-for="recipe in recipesStore.allRecipes" 
        :key="recipe.id"
        class="recipe-card"
        @click="selectRecipe(recipe)"
      >
        <div class="recipe-image">
          <img :src="recipe.image" :alt="recipe.title" />
        </div>
        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-stats">
            <span class="recipe-steps">{{ recipe.steps.length }} {{ getStepText(recipe.steps.length) }}</span>
            <span class="recipe-time">{{ getTotalTime(recipe) }} мин</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
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
}

.recipe-steps,
.recipe-time {
  background: #f7fafc;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}
</style>
