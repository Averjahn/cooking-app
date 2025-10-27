/**
 * Композабл для управления параллельными таймерами
 */

import { ref, onUnmounted } from 'vue'

interface SimpleTimerState {
  timeLeft: number
  isRunning: boolean
  interval: number | null
}

export function useSimpleTimer(playSound?: () => Promise<void>) {
  
  // Состояние таймеров
  const timers = ref<Map<string, SimpleTimerState>>(new Map())
  
  // Состояние подтвержденных шагов
  const confirmedSteps = ref<Set<string>>(new Set())

  // Воспроизведение звука таймера
  const playTimerSound = () => {
    if (playSound) {
      playSound()
    }
  }



  /**
   * Запуск таймера - точно как в оригинале
   */
  const startTimer = (action: string, timerSeconds: number): void => {
    const timer: SimpleTimerState = {
      timeLeft: timerSeconds,
      isRunning: true,
      interval: null
    }
    
    timer.interval = window.setInterval(() => {
      timer.timeLeft--
      
      // Принудительно обновляем реактивность
      timers.value = new Map(timers.value)
      
      if (timer.timeLeft <= 0) {
        // Сразу воспроизводим звук и останавливаем таймер - ТОЧНО как в оригинале
        playTimerSound()
        stopTimer(action)
      }
    }, 1000)
    
    timers.value.set(action, timer)
  }

  /**
   * Остановка таймера
   */
  const stopTimer = (action: string): void => {
    const timer = timers.value.get(action)
    if (timer?.interval) {
      clearInterval(timer.interval)
      timer.isRunning = false
      timer.interval = null
      timers.value = new Map(timers.value)
    }
  }

  /**
   * Получение времени, оставшееся в таймере
   */
  const getTimeLeft = (action: string): number => {
    const timer = timers.value.get(action)
    return timer?.timeLeft || 0
  }

  /**
   * Проверка, активен ли таймер
   */
  const isTimerActive = (action: string): boolean => {
    const timer = timers.value.get(action)
    return timer ? timer.isRunning && timer.timeLeft > 0 : false
  }

  /**
   * Проверка, завершен ли таймер
   */
  const isTimerCompleted = (action: string): boolean => {
    const timer = timers.value.get(action)
    return timer ? timer.timeLeft <= 0 && !timer.isRunning : false
  }

  /**
   * Подтверждение шага
   */
  const confirmStep = (action: string): void => {
    confirmedSteps.value.add(action)
    confirmedSteps.value = new Set(confirmedSteps.value)
  }

  /**
   * Проверка, подтвержден ли шаг
   */
  const isStepConfirmed = (action: string): boolean => {
    return confirmedSteps.value.has(action)
  }

  /**
   * Форматирование времени
   */
  const formatTime = (action: string): string => {
    const timeLeft = getTimeLeft(action)
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Количество завершенных шагов
   */
  const getCompletedStepsCount = (): number => {
    return confirmedSteps.value.size
  }

  /**
   * Проверка завершения всех шагов
   */
  const areAllStepsCompleted = (totalSteps: number): boolean => {
    return confirmedSteps.value.size >= totalSteps
  }

  /**
   * Получение прогресса
   */
  const getProgress = (totalSteps: number): number => {
    if (totalSteps === 0) return 100
    return Math.round((confirmedSteps.value.size / totalSteps) * 100)
  }

  /**
   * Сброс всех данных
   */
  const reset = (): void => {
    // Останавливаем все таймеры
    timers.value.forEach((_, action) => stopTimer(action))
    timers.value.clear()
    confirmedSteps.value.clear()
    confirmedSteps.value = new Set()
  }

  // Очистка при размонтировании
  onUnmounted(() => {
    reset()
  })

  return {
    // Методы
    startTimer,
    stopTimer,
    getTimeLeft,
    isTimerActive,
    isTimerCompleted,
    confirmStep,
    isStepConfirmed,
    formatTime,
    getCompletedStepsCount,
    areAllStepsCompleted,
    getProgress,
    reset,

    // Состояние
    confirmedSteps,
    timers
  }
}
