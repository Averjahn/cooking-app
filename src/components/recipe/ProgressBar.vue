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
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
}

.progress-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.progress-numbers {
  font-size: 0.85rem;
  color: #4a5568;
}

.progress-percentage {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a202c;
  min-width: 40px;
  text-align: right;
}

/* Прогресс-бар - базовые стили */
.progress-bar {
  width: 100%;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
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
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Варианты цветов */
.progress-fill--default {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.progress-fill--success {
  background: linear-gradient(90deg, #48bb78, #38a169);
}

.progress-fill--warning {
  background: linear-gradient(90deg, #f6ad55, #ed8936);
}

.progress-fill--danger {
  background: linear-gradient(90deg, #f56565, #e53e3e);
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
    rgba(255, 255, 255, 0.4),
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
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Высокий контраст для лучшей доступности */
@media (prefers-contrast: high) {
  .progress-bar {
    border: 1px solid #000;
  }
  
  .progress-fill--default {
    background: #000;
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
