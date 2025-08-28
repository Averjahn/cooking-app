import type { Recipe } from '../types/recipes'

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
          { name: "Спагетти", icon: "🍝" },
          { name: "Бекон", icon: "🥓" },
          { name: "Яйца", icon: "🥚" },
          { name: "Пармезан", icon: "🧀" },
          { name: "Черный перец", icon: "🌶️" },
          { name: "Соль", icon: "🧂" }
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
        text: "Отварите спагетти в подсоленной воде",
        ingredients: [],
        timer: 5,
        fire: 8,
        buttons: ["Спагетти готовы"]
      },
      {
        id: 4,
        type: "step",
        text: "Обжарьте бекон до хрустящего состояния",
        ingredients: [],
        timer: 5,
        fire: 7,
        buttons: ["Бекон готов"]
      },
      {
        id: 5,
        type: "step",
        text: "Смешайте яйца с тертым пармезаном и перцем",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Смешано"]
      },
      {
        id: 6,
        type: "step",
        text: "Добавьте горячие спагетти к яичной смеси, перемешайте",
        ingredients: [],
        timer: null,
        fire: null,
        buttons: ["Готово"]
      }
    ]
  }
]

export default recipes
