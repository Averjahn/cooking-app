<script setup lang="ts">
import { useRecipesStore } from '../stores/recipes'
import { pluralizeStep } from '../utils/pluralize'

const recipesStore = useRecipesStore()
</script>

<template>
  <div class="recipes-container">
    <div class="recipes-grid">
      <div 
        v-for="recipe in recipesStore.allRecipes" 
        :key="recipe.id"
        class="recipe-card"
        @click="recipesStore.setCurrentRecipe(recipe)"
      >
        <div class="recipe-image">
          <img :src="recipe.image" :alt="recipe.title" />
        </div>
        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-stats">
            <span class="recipe-steps">{{ recipe.steps.length }} {{ pluralizeStep(recipe.steps.length) }}</span>
            <span class="recipe-time">{{ getTotalTime(recipe) }} мин</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Recipe } from '../types/recipes'

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

<style scoped>
.recipes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.recipes-grid {
  padding: 0 20px;
  width: 100%;
  max-width: 800px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.recipe-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.recipe-image {
  width: 100%;
  height: 200px;
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
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.recipe-description {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-steps,
.recipe-time {
  background: #f7fafc;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
