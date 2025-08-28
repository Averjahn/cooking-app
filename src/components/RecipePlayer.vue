<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRecipesStore } from '../stores/recipes'
import type { Recipe } from '../types/recipes'

interface Props {
  recipe: Recipe
}

const props = defineProps<Props>()
const recipesStore = useRecipesStore()

// Состояние таймера
const isTimerRunning = ref(false)
const timeLeft = ref(0)
const timerInterval = ref<number | null>(null)

// Отдельные таймеры для параллельных блоков
const parallelTimers = ref<Map<string, TimerState>>(new Map())

// Состояние нажатых кнопок "Готово"
const confirmedSteps = ref<Set<string>>(new Set())

// Аудио для таймера
const timerAudio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav')

// Типы для таймера
interface TimerState {
  timeLeft: number
  isRunning: boolean
  interval: number | null
}

// Текущий шаг
const currentStep = computed(() => {
  if (recipesStore.currentStepIndex < props.recipe.steps.length) {
    return props.recipe.steps[recipesStore.currentStepIndex]
  }
  return null
})

// Проверяем, является ли текущий шаг параллельным
const isParallelStep = computed(() => currentStep.value?.type === 'parallel')

// Проверяем, завершены ли все параллельные шаги
const allParallelStepsCompleted = computed(() => {
  if (!isParallelStep.value || !currentStep.value) return false
  return confirmedSteps.value.size >= currentStep.value.buttons.length
})

// Запуск таймера для параллельного блока
const startParallelTimer = (action: string, timerSeconds: number) => {
  const timer: TimerState = {
    timeLeft: timerSeconds,
    isRunning: true,
    interval: null
  }
  
  timer.interval = window.setInterval(() => {
    timer.timeLeft--
    
    // Принудительно обновляем реактивность
    parallelTimers.value = new Map(parallelTimers.value)
    
    if (timer.timeLeft <= 0) {
      // Сразу воспроизводим звук и останавливаем таймер
      playTimerSound()
      stopParallelTimer(action)
    }
  }, 1000)
  
  parallelTimers.value.set(action, timer)
}

// Воспроизведение звука таймера
const playTimerSound = async () => {
  try {
    // Сбрасываем аудио в начало
    timerAudio.currentTime = 0
    await timerAudio.play()
  } catch (error) {
    console.log('⏰ Таймер завершен! (звук не воспроизвелся)')
  }
}

// Остановка таймера для параллельного блока
const stopParallelTimer = (action: string) => {
  const timer = parallelTimers.value.get(action)
  if (timer?.interval) {
    clearInterval(timer.interval)
    timer.isRunning = false
    timer.interval = null
    parallelTimers.value = new Map(parallelTimers.value)
  }
}

// Получение времени для параллельного блока
const getParallelTimerTime = (action: string): number => {
  const timer = parallelTimers.value.get(action)
  return timer?.timeLeft || 0
}

// Проверка завершения таймера для параллельного блока
const isParallelTimerCompleted = (action: string): boolean => {
  const timer = parallelTimers.value.get(action)
  return timer ? timer.timeLeft <= 0 : false
}

// Проверка активности таймера для параллельного блока
const isParallelTimerActive = (action: string): boolean => {
  const timer = parallelTimers.value.get(action)
  return timer ? timer.isRunning && timer.timeLeft > 0 : false
}

// Получение количества завершенных параллельных шагов
const getCompletedStepsCount = () => confirmedSteps.value.size

// Обработка нажатия кнопки "Готово"
const confirmStep = (action: string) => {
  confirmedSteps.value.add(action)
  confirmedSteps.value = new Set(confirmedSteps.value)
}

// Запуск основного таймера
const startTimer = () => {
  if (!currentStep.value?.timer) return
  
  timeLeft.value = currentStep.value.timer
  isTimerRunning.value = true
  
  timerInterval.value = window.setInterval(() => {
    timeLeft.value--
    
    if (timeLeft.value <= 0) {
      stopTimer()
      playTimerSound()
    }
  }, 1000)
}

// Остановка основного таймера
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  isTimerRunning.value = false
}

// Переход к следующему шагу
const nextStep = () => {
  stopTimer()
  recipesStore.nextStep()
}

// Переход к предыдущему шагу
const previousStep = () => {
  stopTimer()
  recipesStore.previousStep()
}

// Возврат к списку рецептов
const backToRecipes = () => {
  stopTimer()
  recipesStore.setCurrentRecipe(null)
}

// Обработка действия шага
const handleStepAction = (action: string) => {
  if (isParallelStep.value) {
    if (action === "Спагетти в воде") {
      startParallelTimer(action, 5)
    } else if (action === "Бекон на сковороде") {
      startParallelTimer(action, 5)
    }
  } else {
    if (currentStep.value?.timer && (action.includes('готовить') || action.includes('в воде') || action.includes('на сковороде'))) {
      startTimer()
    }
    nextStep()
  }
}

// Очистка при размонтировании
onUnmounted(() => {
  stopTimer()
  // Очищаем все параллельные таймеры
  for (const [action] of parallelTimers.value) {
    stopParallelTimer(action)
  }
})

// Форматирование времени
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="recipe-player">
    <!-- Кнопка выхода -->
    <div class="exit-section">
      <button @click="backToRecipes" class="exit-button">
        ← Назад к рецептам
      </button>
    </div>

    <!-- Заголовок рецепта -->
    <div class="recipe-header">
      <h2 class="recipe-title">{{ recipe.title }}</h2>
      <div class="step-indicator">
        Шаг {{ recipesStore.currentStepIndex + 1 }} из {{ recipe.steps.length }}
      </div>
    </div>

    <!-- Текущий шаг -->
    <div v-if="currentStep" class="step-content">
      <!-- Шаг с ингредиентами -->
      <div v-if="currentStep.type === 'ingredients'" class="ingredients-step">
        <h3 class="step-title">{{ currentStep.text }}</h3>
        <div class="ingredients-grid">
          <div 
            v-for="ingredient in currentStep.ingredients" 
            :key="ingredient.name"
            class="ingredient-item"
          >
            <div class="ingredient-icon">{{ ingredient.icon }}</div>
            <span class="ingredient-name">{{ ingredient.name }}</span>
          </div>
        </div>
      </div>

      <!-- Параллельный шаг -->
      <div v-else-if="currentStep.type === 'parallel'" class="parallel-step">
        <h3 class="step-title">{{ currentStep.text }}</h3>
        <div class="parallel-actions">
          <div 
            v-for="button in currentStep.buttons" 
            :key="button"
            :class="['parallel-action', { 
              'completed': confirmedSteps.has(button),
              'timer-active': isParallelTimerActive(button),
              'timer-completed': isParallelTimerCompleted(button) && !confirmedSteps.has(button),
              'confirmed': confirmedSteps.has(button)
            }]"
          >
            <div class="action-icon">
              {{ button.includes('Спагетти') ? '🍝' : '🥓' }}
            </div>
            <span class="action-text">
              {{ button.includes('Спагетти') ? 'Спагетти' : 'Бекон' }}
            </span>
            
            <!-- Кнопка или таймер -->
            <div v-if="!isParallelTimerActive(button) && !isParallelTimerCompleted(button)" class="parallel-button-container">
              <button 
                @click="handleStepAction(button)"
                class="parallel-button"
              >
                {{ button }}
              </button>
            </div>
            
            <!-- Таймер -->
            <div v-else-if="isParallelTimerActive(button)" class="parallel-timer">
              <div class="timer-countdown">
                {{ formatTime(getParallelTimerTime(button)) }}
              </div>
            </div>
            
            <!-- Кнопка "Готово" после истечения таймера -->
            <div v-else-if="isParallelTimerCompleted(button) && !confirmedSteps.has(button)" class="parallel-ready">
              <button @click="confirmStep(button)" class="ready-button">
                Готово
              </button>
            </div>
            
            <!-- Завершено (после нажатия "Готово") -->
            <div v-else-if="confirmedSteps.has(button)" class="parallel-completed">
              <span class="checkmark">✓</span>
              Готово
            </div>
          </div>
        </div>
        
        <!-- Индикатор прогресса -->
        <div class="parallel-progress">
          <div class="progress-text">
            Завершено: {{ getCompletedStepsCount() }} из {{ currentStep.buttons.length }}
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(getCompletedStepsCount() / currentStep.buttons.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Шаг с действием -->
      <div v-else class="action-step">
        <h3 class="step-title">{{ currentStep.text }}</h3>
        
        <!-- Информация об огне -->
        <div v-if="currentStep.fire" class="fire-info">
          🔥 Огонь: {{ currentStep.fire }}/9
        </div>

        <!-- Таймер (показывается только если есть) -->
        <div v-if="currentStep.timer && timeLeft > 0" class="timer-section">
          <div class="timer-display">
            {{ formatTime(timeLeft) }}
          </div>
          <div class="timer-status">
            ⏱️ Таймер запущен
          </div>
        </div>
      </div>

      <!-- Кнопки навигации -->
      <div class="step-navigation">
        <button 
          v-if="!recipesStore.isFirstStep"
          @click="previousStep"
          class="nav-button prev"
        >
          ← Назад
        </button>
        
        <!-- Кнопка "Далее" для параллельных шагов -->
        <div v-if="isParallelStep && allParallelStepsCompleted" class="next-button-container">
          <button @click="nextStep" class="nav-button next">
            Далее →
          </button>
        </div>
        
        <!-- Показываем кнопки только для непараллельных шагов -->
        <div v-else-if="!isParallelStep" class="step-buttons">
          <button 
            v-for="button in currentStep.buttons"
            :key="button"
            @click="handleStepAction(button)"
            class="step-button"
          >
            {{ button }}
          </button>
        </div>
      </div>
    </div>

    <!-- Завершение рецепта -->
    <div v-else class="recipe-complete">
      <div class="complete-icon">🎉</div>
      <h3>Рецепт завершен!</h3>
      <p>Поздравляем! Вы успешно приготовили {{ recipe.title }}</p>
      <button @click="backToRecipes" class="complete-button">
        Вернуться к рецептам
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Основные переменные */
:root {
  --primary-color: #667eea;
  --primary-hover: #5a67d8;
  --success-color: #48bb78;
  --success-hover: #38a169;
  --warning-color: #f6ad55;
  --danger-color: #f56565;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --bg-light: #f7fafc;
  --border-light: #e2e8f0;
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.15);
  --border-radius: 16px;
  --transition: all 0.3s ease;
}

/* Основной контейнер */
.recipe-player {
  width: 100dvw;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

/* Секция выхода */
.exit-section {
  text-align: center;
  margin: 2rem 0 1rem 0;
}

.exit-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.exit-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Заголовок рецепта */
.recipe-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.recipe-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.step-indicator {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* Контент шага */
.step-content {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

/* Шаг с ингредиентами */
.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ingredient-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.ingredient-icon {
  font-size: 2rem;
  margin-bottom: 0.3rem;
}

.ingredient-name {
  font-weight: 500;
  color: #1a202c;
  font-size: 0.8rem;
}

/* Информация об огне */
.fire-info {
  background: #fed7d7;
  color: #742a2a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.85rem;
}

/* Параллельные блоки */
.parallel-step {
  text-align: center;
  width: 100%;
}

.parallel-actions {
  display: flex;
  justify-content: center;
  gap: 3vw;
  margin: 2rem 0;
  width: 100%;
}

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

.parallel-action.completed {
  background: #f0fff4;
  border-color: #48bb78;
}

.parallel-action.timer-active {
  background: #fef5e7;
  border-color: #f6ad55;
}

.parallel-action.timer-completed {
  background: #fed7d7;
  border-color: #f56565;
  animation: pulse-alert 1s infinite;
}

.parallel-action.timer-completed.confirmed {
  background: rgba(72, 187, 120, 0.7);
  border-color: rgba(72, 187, 120, 0.8);
  animation: none;
}

@keyframes pulse-alert {
  0% { 
    transform: scale(1); 
    background: #fed7d7; 
  }
  50% { 
    transform: scale(1.1); 
    background: #feb2b2; 
  }
  100% { 
    transform: scale(1); 
    background: #fed7d7; 
  }
}

/* Иконки и текст в параллельных блоках */
.action-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.action-text {
  font-weight: 600;
  color: #1a202c;
  font-size: 1rem;
  margin-bottom: 1rem;
}

/* Кнопки в параллельных блоках */
.parallel-button-container {
  margin-top: 0.5rem;
  text-align: center;
}

.parallel-button {
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

.parallel-button:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.parallel-button.completed {
  background: #48bb78;
  cursor: default;
}

.parallel-button:disabled {
  cursor: default;
  opacity: 0.8;
}

/* Таймер в параллельных блоках */
.parallel-timer {
  margin-top: 0.5rem;
  text-align: center;
}

.timer-countdown {
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

/* Кнопка "Готово" */
.parallel-ready {
  margin-top: 0.5rem;
  text-align: center;
}

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
  transform: translateY(-2px);
}

/* Завершенное состояние */
.parallel-completed {
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
  color: white;
}

/* Индикатор прогресса */
.parallel-progress {
  margin-top: 2rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
}

.progress-text {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  transition: width 0.3s ease;
  border-radius: 4px;
  width: 0%;
}

/* Таймер */
.timer-section {
  text-align: center;
  margin-bottom: 1rem;
}

.timer-display {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
}

.timer-status {
  font-size: 0.8rem;
  color: #4a5568;
  margin-top: 0.25rem;
}

/* Навигация по шагам */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  width: 100%;
}

.nav-button {
  background: #667eea;
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
}

.nav-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.nav-button.next {
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
}

.nav-button.next:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.next-button-container {
  display: flex;
  justify-content: center;
  margin: 0;
}

.step-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  flex: 1;
}

.step-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.step-button:hover {
  background: #38a169;
  transform: translateY(-2px);
}

/* Завершение рецепта */
.recipe-complete {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.complete-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.recipe-complete h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
}

.recipe-complete p {
  color: #4a5568;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
}

.complete-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 18px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-button:hover {
  background: #38a169;
  transform: translateY(-2px);
}
</style>
