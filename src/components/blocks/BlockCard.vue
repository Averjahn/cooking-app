<!--
  Карточка блока рецепта
  Отображает информацию о блоке и его статус
-->

<script setup lang="ts">
import { computed } from 'vue'
import type { CookingBlock } from '../../types/recipes'

interface Props {
  /** Блок для отображения */
  block: CookingBlock
  /** Завершен ли блок */
  isCompleted?: boolean
  /** Доступен ли блок для начала */
  isAvailable?: boolean
  /** Активен ли блок сейчас */
  isActive?: boolean
}

interface Emits {
  /** Событие нажатия на блок */
  (e: 'click', blockId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isCompleted: false,
  isAvailable: true,
  isActive: false
})

const emit = defineEmits<Emits>()

/**
 * CSS классы для карточки в зависимости от состояния
 */
const cardClasses = computed(() => [
  'block-card',
  {
    'block-card--completed': props.isCompleted,
    'block-card--active': props.isActive,
    'block-card--disabled': !props.isAvailable,
    'block-card--available': props.isAvailable && !props.isCompleted && !props.isActive
  }
])

/**
 * Текст кнопки в зависимости от состояния
 */
const buttonText = computed(() => {
  if (props.isCompleted) return 'Готово ✓'
  if (props.isActive) return 'В процессе...'
  if (!props.isAvailable) return 'Заблокировано'
  return 'Начать'
})

/**
 * Обработчик клика по карточке
 */
const handleClick = () => {
  if (props.isAvailable && !props.isCompleted) {
    emit('click', props.block.id)
  }
}

/**
 * Форматирование времени
 */
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} мин`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}ч ${remainingMinutes}м` : `${hours}ч`
}
</script>

<template>
  <div 
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- Иконка блока -->
    <div class="block-card__icon">
      {{ block.icon }}
    </div>

    <!-- Контент блока -->
    <div class="block-card__content">
      <h3 class="block-card__title">{{ block.title }}</h3>
      <p class="block-card__description">{{ block.description }}</p>
      
      <!-- Время выполнения -->
      <div class="block-card__time">
        {{ formatTime(block.estimatedTime) }}
      </div>
    </div>

    <!-- Кнопка/статус -->
    <div class="block-card__action">
      <button 
        :class="[
          'block-card__button',
          {
            'block-card__button--completed': isCompleted,
            'block-card__button--active': isActive,
            'block-card__button--disabled': !isAvailable
          }
        ]"
        :disabled="!isAvailable || isCompleted"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.block-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.block-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.block-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.block-card--disabled:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.block-card--completed {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

.block-card--active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  animation: pulse 2s infinite;
}

.block-card--available:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

.block-card__icon {
  font-size: 3rem;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.block-card__content {
  flex: 1;
  min-width: 0;
}

.block-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
}

.block-card__description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.block-card__time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.block-card__action {
  flex-shrink: 0;
}

.block-card__button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.block-card__button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.block-card__button--completed {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
  color: white;
}

.block-card__button--active {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  color: white;
}

.block-card__button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

