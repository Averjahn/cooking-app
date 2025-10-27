<!--
  Компонент для параллельных шагов
  Управляет параллельными действиями и их таймерами
-->

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { RecipeStep } from '../../types/recipes'
import { useSimpleTimer } from '../../composables/useSimpleTimer'
import ParallelAction from './ParallelAction.vue'
import ProgressBar from './ProgressBar.vue'

interface Props {
  /** Шаг рецепта с параллельными действиями */
  step: RecipeStep
}

interface Emits {
  /** Все параллельные действия завершены */
  (e: 'all-completed'): void
  /** Действие запущено */
  (e: 'action-started', action: string): void
  /** Действие завершено */
  (e: 'action-completed', action: string): void
}

// Определяем пропсы и события
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Создаем audio прямо в компоненте - ТОЧНО как в оригинале
const timerAudio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav')

// Функция воспроизведения звука - ТОЧНО как в оригинале
const playTimerSound = async () => {
  try {
    timerAudio.currentTime = 0
    await timerAudio.play()
  } catch (error) {
    console.log('⏰ Таймер завершен! (звук не воспроизвелся)')
  }
}

// Используем простой композабл для параллельных таймеров
const {
  startTimer,
  isTimerActive,
  isTimerCompleted,
  isStepConfirmed,
  confirmStep,
  getTimeLeft,
  formatTime,
  getCompletedStepsCount,
  getProgress,
  areAllStepsCompleted
} = useSimpleTimer(playTimerSound)

/**
 * Обработчик запуска действия
 */
const handleActionStart = (action: string): void => {
  // Определяем длительность таймера в зависимости от действия
  const duration = getDurationForAction(action)
  
  startTimer(action, duration)
  emit('action-started', action)
  

}

/**
 * Обработчик подтверждения действия
 */
const handleActionConfirm = (action: string): void => {
  confirmStep(action)
  emit('action-completed', action)
  
  // Проверяем, завершены ли все действия
  if (areAllStepsCompleted(props.step.buttons.length)) {
    emit('all-completed')
  }
}



/**
 * Получает длительность таймера для действия
 */
const getDurationForAction = (action: string): number => {
  // Временно используем 5 секунд для отладки
  // В будущем можно добавить в данные рецепта
  if (action.includes('Спагетти')) return 5
  if (action.includes('Бекон')) return 5
  
  return 30 // по умолчанию
}

/**
 * Получает иконку для действия
 */
const getIconForAction = (action: string): string => {
  if (action.includes('Спагетти') || action.includes('спагетти')) return '🍝'
  if (action.includes('Бекон') || action.includes('бекон')) return '🥓'
  if (action.includes('мясо')) return '🥩'
  if (action.includes('овощи')) return '🥬'
  if (action.includes('рыба')) return '🐟'
  
  return '👨‍🍳' // по умолчанию
}

/**
 * Получает название для действия (короткое)
 */
const getShortNameForAction = (action: string): string => {
  if (action.includes('Спагетти')) return 'Спагетти'
  if (action.includes('Бекон')) return 'Бекон'
  
  // Берем первое слово
  return action.split(' ')[0]
}

// Вычисляемые свойства
const progressPercentage = computed(() => getProgress(props.step.buttons.length))
const allCompleted = computed(() => areAllStepsCompleted(props.step.buttons.length))
const completedStepsCount = computed(() => getCompletedStepsCount())

// Отслеживаем изменения завершенности всех шагов
watch(allCompleted, (newValue) => {
  if (newValue) {
    emit('all-completed')
  }
}, { immediate: true })
</script>

<template>
  <div class="parallel-step">
    <!-- Заголовок -->
    <h3 class="step-title">{{ step.text }}</h3>
    
    <!-- Параллельные действия -->
    <div class="parallel-actions">
      <ParallelAction
        v-for="action in step.buttons"
        :key="action"
        :action="action"
        :icon="getIconForAction(action)"
        :short-name="getShortNameForAction(action)"
        :is-active="isTimerActive(action)"
        :is-completed="isTimerCompleted(action)"
        :is-confirmed="isStepConfirmed(action)"
        :time-left="getTimeLeft(action)"
        :formatted-time="formatTime(action)"
        @start="handleActionStart"
        @confirm="handleActionConfirm"
      />
    </div>
    
    <!-- Индикатор прогресса -->
    <ProgressBar
      :current="completedStepsCount"
      :total="step.buttons.length"
      :percentage="progressPercentage"
      label="Завершено действий"
      class="parallel-progress"
    />
    
  </div>
</template>

<style scoped>
/* Контейнер параллельного шага */
.parallel-step {
  text-align: center;
  width: 100%;
}

/* Заголовок */
.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
}

/* Контейнер действий */
.parallel-actions {
  display: flex;
  justify-content: center;
  gap: 3vw;
  margin: 2rem 0;
  width: 100%;
}

/* Прогресс */
.parallel-progress {
  margin-top: 2rem;
}

/* Убираем сообщение о завершении - оно лишнее */

/* Адаптивность - НЕ меняем на колонку! */
@media (max-width: 768px) {
  .parallel-actions {
    gap: 2vw;
  }
  
  .step-title {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .parallel-actions {
    gap: 1rem;
  }
  
  .completion-message {
    padding: 0.75rem;
  }
  
  .completion-icon {
    font-size: 1.5rem;
  }
}

</style>
