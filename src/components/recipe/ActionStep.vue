<!--
  Компонент для обычного шага с действием
  Отображает текст, информацию об огне, таймер и кнопки
-->

<script setup lang="ts">
import { computed } from 'vue'
import type { RecipeStep } from '../../types/recipes'
import { ref } from 'vue'

interface Props {
  /** Шаг рецепта */
  step: RecipeStep
}

interface Emits {
  /** Событие нажатия на кнопку действия */
  (e: 'action-click', action: string): void
  /** Таймер завершен */
  (e: 'timer-finished'): void
}

// Определяем пропсы и события
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Простая заглушка для таймера (не используется в ActionStep)
const timeLeft = ref(0)
const isRunning = ref(false)
const formatTime = () => '0:00'
const getProgress = (_totalSeconds: number) => 0

/**
 * Обработчик нажатия на кнопку действия
 */
const handleActionClick = (action: string): void => {
  emit('action-click', action)
}



/**
 * Форматирует информацию об огне
 */
const fireInfo = computed(() => {
  if (!props.step.fire) return null
  return `Огонь: ${props.step.fire}/9`
})

/**
 * Проверяет, есть ли активный таймер
 */
const hasActiveTimer = computed(() => {
  return props.step.timer && isRunning.value
})

/**
 * Процент завершения таймера
 */
const timerProgress = computed(() => {
  if (!props.step.timer) return 0
  return getProgress(props.step.timer)
})

/**
 * Статус таймера для отображения
 */
const timerStatus = computed(() => {
  if (!isRunning.value) return null
  
  const minutes = Math.floor(timeLeft.value / 60)
  if (minutes > 0) {
    return `Осталось ${minutes} мин.`
  } else {
    return 'Почти готово!'
  }
})
</script>

<template>
  <div class="action-step">
    <!-- Заголовок шага -->
    <h3 class="step-title">{{ step.text }}</h3>
    
    <!-- Информация об огне -->
    <div v-if="fireInfo" class="fire-info">
      🔥 {{ fireInfo }}
    </div>
    
    <!-- Таймер (показывается только если активен) -->
    <div v-if="hasActiveTimer" class="timer-section">
      <div class="timer-display">
        {{ formatTime() }}
      </div>
      
      <div v-if="timerStatus" class="timer-status">
        ⏱️ {{ timerStatus }}
      </div>
      
      <!-- Прогресс-бар таймера -->
      <div class="timer-progress">
        <div class="timer-progress-bar">
          <div 
            class="timer-progress-fill"
            :style="{ width: `${timerProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Кнопки действий -->
    <div v-if="step.buttons.length > 0" class="action-buttons">
      <button
        v-for="button in step.buttons"
        :key="button"
        @click="handleActionClick(button)"
        class="action-button"
        :disabled="!!hasActiveTimer"
      >
        <span v-if="step.timer" class="button-icon">⏱️</span>
        {{ button }}
      </button>
    </div>
    
    <!-- Дополнительная информация -->
    <div v-if="step.timer && !isRunning" class="timer-hint">
      <span class="hint-icon">💡</span>
      <span class="hint-text">
        Таймер запустится автоматически при нажатии на кнопку
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Контейнер шага */
.action-step {
  width: 100%;
  text-align: center;
}

/* Заголовок */
.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
}

/* Информация об огне */
.fire-info {
  background: #fed7d7;
  color: #742a2a;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #feb2b2;
}

/* Секция таймера */
.timer-section {
  background: #f7fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-status {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

/* Прогресс таймера */
.timer-progress {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.timer-progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.timer-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Кнопки действий */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: end;
  flex-wrap: wrap;
  margin: 0;
}

.action-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  min-width: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-button:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
}

.action-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.button-icon {
  font-size: 0.9rem;
}

/* Подсказка */
.timer-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #edf2f7;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4a5568;
}

.hint-icon {
  font-size: 1rem;
}

.hint-text {
  font-style: italic;
}

/* Адаптивность */
@media (max-width: 768px) {
  .action-buttons {
    justify-content: center;
  }
  
  .timer-display {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .action-button {
    min-width: 80px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .timer-display {
    font-size: 1.8rem;
  }
  
  .timer-section {
    padding: 1rem;
  }
  
  .fire-info {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .timer-hint {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
}

/* Анимации */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-step {
  animation: slideIn 0.3s ease-out;
}

.timer-section {
  animation: slideIn 0.5s ease-out;
}

/* Пульсация для активного таймера */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.timer-display {
  animation: pulse 2s ease-in-out infinite;
}
</style>
