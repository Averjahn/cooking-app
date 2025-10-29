// Базовые интерфейсы
export interface RecipeIngredient {
  name: string // Название ингредиента - текст для отображения
  amount?: string // Количество - важно для покупок и подготовки (делаем опциональным для простых карточек)
  icon: string // Иконка ингредиента - визуальная помощь для быстрого поиска
}

// Объекты синхронизации
export interface ScheduleTransition {
  triggerAfter: number // Через сколько секунд показать уведомление - точный расчет синхронизации
  targetBlock: string // ID целевого блока - куда переходить
  message: string // Текст уведомления - объяснение пользователю
  reasoning: string // Объяснение логики - для понимания синхронизации
  actionType: 'suggest-start' | 'auto-start' | 'notification' // Тип действия - определяет поведение UI
}

export interface ScheduleAction {
  triggerAfter: number // За сколько секунд до конца текущего шага
  actionType: string // Тип действия - определяет поведение системы
  message: string // Текст уведомления
  reasoning: string // Объяснение логики
}

export interface OnCompletion {
  instruction: string // Что делать с готовым продуктом
  waitMessage: string // Сообщение во время ожидания зависимостей
}

// Шаг внутри блока
export interface BlockStep {
  id: number // Порядковый номер шага в блоке - для навигации и прогресса
  type: 'ingredients' | 'step' // Тип шага - определяет компонент для рендеринга
  title: string // Заголовок шага - основная инструкция
  ingredients?: RecipeIngredient[] // Массив ингредиентов - только для type: "ingredients"
  timer?: number // Время таймера в секундах - запускает обратный отсчет
  timerType?: 'active' | 'background' // Тип таймера - определяет поведение UI
  fire?: number // Уровень огня 1-9 - отображается как индикатор пламени
  estimatedTime: number // Время выполнения в минутах - для прогресса
  instruction?: string // Дополнительная инструкция - подсказка во время выполнения
  note?: string // Важный совет - критичная информация для успеха
  nextAction: 'continue' | 'complete-block' // Что делать после шага - логика навигации
  scheduleTransition?: ScheduleTransition // Планирование автоматического перехода к другому блоку
  scheduleAction?: ScheduleAction // Планирование дополнительного действия во время выполнения шага
  onCompletion?: OnCompletion // Действия после завершения шага
}

// Блок рецепта
export interface CookingBlock {
  id: string // Уникальный ID блока - используется для ссылок и переходов между блоками
  title: string // Название блока - отображается на карточке
  icon: string // Иконка блока - визуальная идентификация на карточке
  description: string // Краткое описание - подзаголовок карточки
  estimatedTime: number // Общее время блока в минутах - для прогресс-бара и планирования
  canStartImmediately?: boolean // Можно ли начать блок сразу - контролирует доступность кнопки "Начать"
  canStartWhen?: string[] // Массив ID блоков-зависимостей - контролирует доступность блока
  requiresAllBlocks?: boolean // Требуется ли завершение ВСЕХ зависимостей - строгая/мягкая зависимость
  steps: BlockStep[] // Массив шагов внутри блока - отображаются при входе в детальный режим
}

// Новый интерфейс для мульти-блочного рецепта
export interface MultiTaskRecipe {
  id: number // Уникальный идентификатор рецепта для хранения в базе/массиве
  title: string // Отображается в заголовке экрана
  description: string // Краткое описание для карточки рецепта
  image: string // Иконка для карточки рецепта в списке
  totalTime: string // Общее время приготовления - показываем пользователю для планирования
  activeTime: string // Время активной работы (без фонового тушения) - важно для планирования дня
  difficulty: string // Уровень сложности - помогает пользователю оценить свои силы
  servings: string // Количество порций - для расчета ингредиентов
  blocks: CookingBlock[] // Массив основных этапов готовки - отображаются как карточки на главном экране
}

// Старые интерфейсы для обратной совместимости
export interface RecipeStep {
  id?: number // делаем опциональным для совместимости с простыми наборами шагов
  type: 'ingredients' | 'step' | 'parallel'
  text: string
  ingredients?: RecipeIngredient[]
  timer?: number | null
  fire?: number | null
  buttons: string[]
  parallelGroup?: number
  autoStartTimer?: boolean
}

export interface Recipe {
  id: number
  title: string
  description: string
  image: string
  steps: RecipeStep[]
}

// Унифицированный тип для работы с любым рецептом
export type AnyRecipe = Recipe | MultiTaskRecipe
