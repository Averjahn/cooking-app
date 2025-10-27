<!--
  Список блоков мульти-блочного рецепта
  Отображает все блоки рецепта с их статусами
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useRecipesStore } from '../../stores/recipes'
import type { MultiTaskRecipe } from '../../types/recipes'
import BlockCard from './BlockCard.vue'

interface Props {
  /** Мульти-блочный рецепт для отображения */
  recipe: MultiTaskRecipe
}

interface Emits {
  /** Событие выбора блока */
  (e: 'select-block', blockId: string): void
  /** Событие возврата к списку рецептов */
  (e: 'back-to-recipes'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const recipesStore = useRecipesStore()

/**
 * Проверяет доступность блока для запуска
 */
const isBlockAvailable = (blockId: string) => {
  return recipesStore.availableBlocks.some(block => block.id === blockId)
}

/**
 * Проверяет завершенность блока
 */
const isBlockCompleted = (blockId: string) => {
  return recipesStore.completedBlocks.has(blockId)
}

/**
 * Проверяет активность блока (выбран сейчас)
 */
const isBlockActive = (blockId: string) => {
  return recipesStore.currentBlockId === blockId
}

/**
 * Обработчик выбора блока
 */
const handleBlockSelect = (blockId: string) => {
  emit('select-block', blockId)
}

/**
 * Обработчик возврата к списку рецептов
 */
const handleBackToRecipes = () => {
  emit('back-to-recipes')
}

/**
 * Подсчет прогресса рецепта
 */
const progress = computed(() => {
  const totalBlocks = props.recipe.blocks.length
  const completedCount = recipesStore.completedBlocks.size
  return Math.round((completedCount / totalBlocks) * 100)
})

/**
 * Текст прогресса
 */
const progressText = computed(() => {
  const completed = recipesStore.completedBlocks.size
  const total = props.recipe.blocks.length
  return `${completed} из ${total} блоков завершено`
})
</script>

<template>
  <div class="block-list">
    <!-- Заголовок рецепта -->
    <div class="block-list__header">
      <button 
        class="block-list__back-button"
        @click="handleBackToRecipes"
      >
        ← К рецептам
      </button>
      
      <div class="block-list__recipe-info">
        <h1 class="block-list__title">{{ recipe.title }}</h1>
        <p class="block-list__description">{{ recipe.description }}</p>
        
        <!-- Информация о рецепте -->
        <div class="block-list__meta">
          <span class="block-list__meta-item">
            🕒 {{ recipe.totalTime }}
          </span>
          <span class="block-list__meta-item">
            👥 {{ recipe.servings }}
          </span>
          <span class="block-list__meta-item">
            📊 {{ recipe.difficulty }}
          </span>
        </div>
      </div>
    </div>

    <!-- Прогресс рецепта -->
    <div class="block-list__progress">
      <div class="block-list__progress-bar">
        <div 
          class="block-list__progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p class="block-list__progress-text">{{ progressText }}</p>
    </div>

    <!-- Список блоков -->
    <div class="block-list__blocks">
      <BlockCard
        v-for="block in recipe.blocks"
        :key="block.id"
        :block="block"
        :is-available="isBlockAvailable(block.id)"
        :is-completed="isBlockCompleted(block.id)"
        :is-active="isBlockActive(block.id)"
        @click="handleBlockSelect"
      />
    </div>

    <!-- Информация о зависимостях -->
    <div class="block-list__help">
      <h3 class="block-list__help-title">💡 Подсказка</h3>
      <p class="block-list__help-text">
        Блоки станут доступны для выполнения по мере завершения предыдущих этапов. 
        Некоторые блоки можно выполнять параллельно!
      </p>
    </div>
  </div>
</template>

<style scoped>
.block-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.block-list__header {
  margin-bottom: 24px;
}

.block-list__back-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.block-list__back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.block-list__recipe-info {
  text-align: center;
}

.block-list__title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.block-list__description {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.block-list__meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.block-list__meta-item {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.block-list__progress {
  margin-bottom: 32px;
  text-align: center;
}

.block-list__progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.block-list__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.block-list__progress-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.block-list__blocks {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.block-list__help {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.block-list__help-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
}

.block-list__help-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .block-list {
    padding: 16px;
  }

  .block-list__title {
    font-size: 1.5rem;
  }

  .block-list__description {
    font-size: 1rem;
  }

  .block-list__meta {
    gap: 8px;
  }

  .block-list__meta-item {
    font-size: 0.75rem;
    padding: 2px 8px;
  }
}
</style>

