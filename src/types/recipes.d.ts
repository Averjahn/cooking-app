export interface RecipeIngredient {
  name: string
  icon: string
}

export interface RecipeStep {
  id: number
  type: 'ingredients' | 'step' | 'parallel'
  text: string
  ingredients: RecipeIngredient[]
  timer: number | null
  fire: number | null
  buttons: string[]
  // Новые поля для параллельных шагов
  parallelGroup?: number // Группа параллельных шагов
  autoStartTimer?: boolean // Автоматический запуск таймера
}

export interface Recipe {
  id: number
  title: string
  description: string
  image: string
  steps: RecipeStep[]
}
