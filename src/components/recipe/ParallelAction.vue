<!--
  Компонент для отдельного параллельного действия
  Отображает состояние действия: кнопка -> таймер -> готово -> подтверждено
-->

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  /** Название действия */
  action: string
  /** Иконка для действия */
  icon: string
  /** Короткое название действия */
  shortName: string
  /** Активен ли таймер */
  isActive: boolean
  /** Завершен ли таймер */
  isCompleted: boolean
  /** Подтверждено ли действие пользователем */
  isConfirmed: boolean
  /** Оставшееся время в секундах */
  timeLeft: number
  /** Отформатированное время */
  formattedTime: string
}

interface Emits {
  /** Запустить действие */
  (e: 'start', action: string): void
  /** Подтвердить завершение */
  (e: 'confirm', action: string): void
}

// Определяем пропсы и события
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Обработчик запуска действия
 */
const handleStart = (): void => {
  emit('start', props.action)
}

/**
 * Обработчик подтверждения
 */
const handleConfirm = (): void => {
  emit('confirm', props.action)
}

/**
 * Вычисляет CSS классы для контейнера
 */
const containerClasses = computed(() => {
  return [
    'parallel-action',
    {
      'timer-active': props.isActive,
      'timer-completed': props.isCompleted && !props.isConfirmed,
      'confirmed': props.isConfirmed
    }
  ]
})

/**
 * Определяет состояние действия для отображения
 */
const actionState = computed(() => {
  if (props.isConfirmed) return 'confirmed'
  if (props.isCompleted) return 'ready'
  if (props.isActive) return 'running'
  return 'waiting'
})
</script>

<template>
  <div :class="containerClasses">
    <!-- Иконка действия -->
    <div class="action-icon">{{ icon }}</div>
    
    <!-- Название действия -->
    <span class="action-text">{{ shortName }}</span>
    
    <!-- Кнопка запуска (начальное состояние) -->
    <div v-if="actionState === 'waiting'" class="action-content">
      <button @click="handleStart" class="action-button">
        {{ action }}
      </button>
    </div>
    
    <!-- Таймер (во время выполнения) -->
    <div v-else-if="actionState === 'running'" class="action-content">
      <div class="timer-display">
        {{ formattedTime }}
      </div>
      <div class="timer-status">Готовится...</div>
    </div>
    
    <!-- Кнопка "Готово" (после завершения таймера) -->
    <div v-else-if="actionState === 'ready'" class="action-content">
      <button @click="handleConfirm" class="ready-button">
        Готово
      </button>
    </div>
    
    <!-- Подтверждено (финальное состояние) -->
    <div v-else-if="actionState === 'confirmed'" class="action-content">
      <div class="confirmed-display">
        <span class="checkmark">✓</span>
        Готово
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Контейнер действия */
.parallel-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  width: 41vw;
  flex-shrink: 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  transform-origin: center;
}

/* Состояния действия */
.parallel-action.timer-active {
  background: #fef5e7;
  border-color: #f6ad55;
}

.parallel-action.timer-completed {
  background: #fed7d7;
  border-color: #f56565;
  animation: pulse-alert 1s infinite;
}

.parallel-action.confirmed {
  background: rgba(72, 187, 120, 0.1);
  border-color: rgba(72, 187, 120, 0.8);
  animation: none;
}

/* Анимация пульсации */
@keyframes pulse-alert {
  0% { 
    transform: scale(1); 
    background: #fed7d7; 
  }
  50% { 
    transform: scale(1.05); 
    background: #feb2b2; 
  }
  100% { 
    transform: scale(1); 
    background: #fed7d7; 
  }
}

/* Иконка */
.action-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

/* Текст действия */
.action-text {
  font-weight: 600;
  color: #1a202c;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.2;
}

/* Контейнер контента */
.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Кнопка действия */
.action-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-button:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* Отображение таймера */
.timer-display {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  font-family: 'Courier New', monospace;
  background: #667eea;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: none;
  min-width: 80px;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-status {
  font-size: 0.75rem;
  color: #4a5568;
  margin-top: 0.5rem;
  text-align: center;
}

/* Кнопка "Готово" */
.ready-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 80px;
}

.ready-button:hover {
  background: #38a169;
  transform: translateY(-1px);
}

/* Подтвержденное состояние */
.confirmed-display {
  margin-top: 0.5rem;
  background: rgba(72, 187, 120, 0.7);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  backdrop-filter: blur(5px);
}

.checkmark {
  font-size: 1.1rem;
  font-weight: bold;
}

/* Не меняем размеры на мобильных - сохраняем оригинальное поведение */

/* Убираем лишние анимации */
</style>
