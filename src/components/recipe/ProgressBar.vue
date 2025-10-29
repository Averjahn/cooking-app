<!--
  Универсальный компонент прогресс-бара
  Отображает прогресс выполнения с текстом и процентами
-->

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  /** Текущее значение */
  current: number
  /** Максимальное значение */
  total: number
  /** Процент выполнения (вычисляется автоматически если не указан) */
  percentage?: number
  /** Текст метки */
  label?: string
  /** Показывать ли числовые значения */
  showNumbers?: boolean
  /** Показывать ли процент */
  showPercentage?: boolean
  /** Цветовая схема */
  variant?: 'default' | 'success' | 'warning' | 'danger'
  /** Размер прогресс-бара */
  size?: 'sm' | 'md' | 'lg'
}

// Определяем пропсы с значениями по умолчанию
const props = withDefaults(defineProps<Props>(), {
  label: 'Прогресс',
  showNumbers: true,
  showPercentage: true,
  variant: 'default',
  size: 'md'
})

/**
 * Вычисляет процент выполнения
 */
const calculatedPercentage = computed(() => {
  if (props.percentage !== undefined) {
    return Math.max(0, Math.min(100, props.percentage))
  }
  
  if (props.total === 0) return 100
  return Math.max(0, Math.min(100, Math.round((props.current / props.total) * 100)))
})

/**
 * Определяет CSS классы для прогресс-бара
 */
const progressClasses = computed(() => {
  return [
    'progress-bar',
    `progress-bar--${props.variant}`,
    `progress-bar--${props.size}`
  ]
})

/**
 * Определяет CSS классы для заполнения
 */
const fillClasses = computed(() => {
  return [
    'progress-fill',
    `progress-fill--${props.variant}`
  ]
})

/**
 * Текст с числовыми значениями
 */
const numbersText = computed(() => {
  return `${props.current} из ${props.total}`
})

/**
 * Проверяет, завершен ли прогресс
 */
const isCompleted = computed(() => {
  return calculatedPercentage.value >= 100
})
</script>

<template>
  <div class="progress-container">
    <!-- Заголовок с информацией -->
    <div class="progress-header">
      <span class="progress-label">{{ label }}</span>
      
      <div class="progress-info">
        <span v-if="showNumbers" class="progress-numbers">
          {{ numbersText }}
        </span>
        <span v-if="showPercentage" class="progress-percentage">
          {{ calculatedPercentage }}%
        </span>
      </div>
    </div>
    
    <!-- Прогресс-бар -->
    <div :class="progressClasses">
      <div 
        :class="fillClasses"
        :style="{ width: `${calculatedPercentage}%` }"
        role="progressbar"
        :aria-valuenow="calculatedPercentage"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`${label}: ${calculatedPercentage}%`"
      >
        <!-- Анимированный блик для завершенного состояния -->
        <div v-if="isCompleted" class="progress-shine"></div>
      </div>
    </div>
    
    <!-- Дополнительная информация -->
    <slot name="extra-info"></slot>
  </div>
</template>

<style scoped>
/* Контейнер */
.progress-container {
  width: 100%;
}

/* Заголовок */
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 700;
  color: #3d2817;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.progress-numbers {
  font-size: 0.85rem;
  color: #3d2817;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.progress-percentage {
  font-size: 0.85rem;
  font-weight: 700;
  color: #3d2817;
  min-width: 40px;
  text-align: right;
  font-family: 'Courier New', monospace;
}

/* Прогресс-бар - базовые стили */
.progress-bar {
  width: 100%;
  background: rgba(61, 40, 23, 0.2);
  border-radius: 0;
  overflow: hidden;
  position: relative;
  border: 2px solid #3d2817;
}

/* Размеры */
.progress-bar--sm {
  height: 6px;
}

.progress-bar--md {
  height: 8px;
}

.progress-bar--lg {
  height: 12px;
}

/* Заполнение - базовые стили */
.progress-fill {
  height: 100%;
  border-radius: 0;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Варианты цветов - Винтажная палитра */
.progress-fill--default {
  background: #3d2817;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.3);
}

.progress-fill--success {
  background: #3d2817;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.4);
}

.progress-fill--warning {
  background: #523825;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.3);
}

.progress-fill--danger {
  background: #3d2817;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.3);
}

/* Анимированный блик */
.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 235, 224, 0.3),
    transparent
  );
  animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Состояния наведения */
.progress-container:hover .progress-fill {
  filter: brightness(1.1);
}

/* Адаптивность */
@media (max-width: 480px) {
  .progress-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .progress-info {
    gap: 0.5rem;
  }
  
  .progress-label,
  .progress-numbers,
  .progress-percentage {
    font-size: 0.8rem;
  }
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-container {
  animation: fadeIn 0.3s ease-out;
}

/* Улучшенная доступность */
.progress-fill:focus {
  outline: 2px solid #3d2817;
  outline-offset: 2px;
}

/* Высокий контраст для лучшей доступности */
@media (prefers-contrast: high) {
  .progress-bar {
    border: 2px solid #3d2817;
  }
  
  .progress-fill--default {
    background: #3d2817;
  }
}

/* Уменьшенная анимация для пользователей с vestibular disorders */
@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none;
  }
  
  .progress-shine {
    animation: none;
  }
}
</style>
