<!--
  Компонент для обычного шага с действием
  Отображает текст, информацию об огне, таймер и кнопки
-->

<script setup lang="ts">
import { computed } from 'vue'
import type { RecipeStep } from '../../types/recipes'
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'

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
const { t } = useI18n()

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
  return `${t('recipe.fire')}: ${props.step.fire}/9`
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
    return `${t('recipe.timeLeft')} ${minutes} ${t('recipe.minutes')}`
  } else {
    return t('recipe.almostReady')
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
        {{ t('recipe.timerHint') }}
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
  font-weight: 700;
  color: #3d2817;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Информация об огне */
.fire-info {
  background: #3d2817;
  color: #f5ebe0;
  padding: 0.75rem 1rem;
  border-radius: 0;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 3px solid #3d2817;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
}

/* Секция таймера */
.timer-section {
  background: #f5ebe0;
  border-radius: 0;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 4px solid #3d2817;
  box-shadow: 4px 4px 0 rgba(61, 40, 23, 0.6);
  position: relative;
}

/* Текстура для таймера */
.timer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.05) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
}

.timer-section > * {
  position: relative;
  z-index: 1;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3d2817;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  text-shadow: none;
  letter-spacing: 2px;
}

.timer-status {
  font-size: 0.9rem;
  color: #3d2817;
  margin-bottom: 1rem;
  font-weight: 700;
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
  background: rgba(61, 40, 23, 0.2);
  border-radius: 0;
  overflow: hidden;
  border: 2px solid #3d2817;
}

.timer-progress-fill {
  height: 100%;
  background: #3d2817;
  border-radius: 0;
  transition: width 0.3s ease;
  box-shadow: inset 0 0 4px rgba(245, 235, 224, 0.3);
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
  background: #3d2817;
  color: #f5ebe0;
  border: 2px solid #3d2817;
  padding: 0.6rem 1.2rem;
  border-radius: 0;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  min-width: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
}

.action-button:hover:not(:disabled) {
  background: #523825;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(61, 40, 23, 0.6);
}

.action-button:disabled {
  background: rgba(61, 40, 23, 0.3);
  color: rgba(245, 235, 224, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  background: #f5ebe0;
  border-radius: 0;
  font-size: 0.85rem;
  color: #3d2817;
  border: 2px solid #3d2817;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-style: normal;
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
