import type { Recipe, MultiTaskRecipe } from '../types/recipes'

// Новый блочный рецепт Рагу Болоньезе
export const raguBolognese: MultiTaskRecipe = {
  id: 2,
  title: "Рагу Болоньезе с тефтелями",
  description: "Классическое итальянское рагу с мясом и тефтелями",
  image: "https://images.unsplash.com/photo-1594756202469-fea237c2b725?w=800&h=600&fit=crop&crop=center",
  totalTime: "3ч 15м",
  activeTime: "1ч 30м",
  difficulty: "сложный",
  servings: "6-8",
  blocks: [
    {
      id: "sauce",
      title: "Соус",
      icon: "🍲",
      description: "Подготовка и тушение основы рагу",
      estimatedTime: 165,
      canStartImmediately: true,
      steps: [
        {
          id: 1,
          type: "ingredients",
          title: "Подготовьте ингредиенты для соуса",
          ingredients: [
            { name: "Свинина", amount: "500г", icon: "🐷" },
            { name: "Телятина", amount: "300г", icon: "🥩" },
            { name: "Колбаски итальянские", amount: "200г", icon: "🌭" },
            { name: "Оливковое масло", amount: "3 ст.л.", icon: "🫒" },
            { name: "Чеснок", amount: "4 зубчика", icon: "🧄" },
            { name: "Томатная паста", amount: "2 ст.л.", icon: "🍅" },
            { name: "Томаты в собственном соку", amount: "800г", icon: "🥫" }
          ],
          estimatedTime: 5,
          nextAction: "continue"
        },
        {
          id: 2,
          type: "step",
          title: "Разогрейте масло на среднем огне в большой кастрюле",
          fire: 5,
          estimatedTime: 2,
          nextAction: "continue"
        },
        {
          id: 3,
          type: "step",
          title: "Обжарьте свинину до румяной корочки со всех сторон",
          timer: 900,
          fire: 5,
          estimatedTime: 15,
          instruction: "Переворачивайте время от времени",
          nextAction: "continue"
        }
      ]
    }
  ]
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Паста Карбонара",
    description: "Классическая итальянская паста с яйцами, сыром и беконом",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&crop=center",
    steps: [
      {
        id: 1,
        type: "ingredients",
        text: "Подготовьте ингредиенты",
        ingredients: [
          { name: "Спагетти", amount: "400г", icon: "🍝" },
          { name: "Бекон", amount: "150г", icon: "🥓" },
          { name: "Яйца", amount: "3 шт", icon: "🥚" },
          { name: "Пармезан", amount: "80г", icon: "🧀" },
          { name: "Черный перец", amount: "по вкусу", icon: "🌶️" },
          { name: "Соль", amount: "по вкусу", icon: "🧂" }
        ],
        timer: null,
        fire: null,
        buttons: ["Начать готовить"]
      },
      {
        id: 2,
        type: "parallel",
        text: "Начните готовить спагетти и бекон одновременно",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Спагетти в воде", "Бекон на сковороде"]
      },
      {
        id: 3,
        type: "step",
        text: "Смешайте яйца с тертым пармезаном и перцем",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Смешано"]
      },
      {
        id: 4,
        type: "step",
        text: "Добавьте горячие спагетти к яичной смеси, перемешайте",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Готово"]
      },
      {
        id: 5,
        type: "step",
        text: "Посыпьте беконом и подавайте горячим",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Завершить"]
      }
    ]
  }
]

export default recipes
