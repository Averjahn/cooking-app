import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    name: 'profile', 
    component: () => import('../views/ProfileView.vue') 
  },
  { 
    path: '/recipes', 
    name: 'recipes', 
    component: () => import('../views/RecipesView.vue') 
  },
  { 
    path: '/recipe/:id', 
    name: 'recipe', 
    component: () => import('../views/RecipeView.vue'),
    props: true
  },
  { 
    path: '/multitask/:id', 
    name: 'multitask', 
    component: () => import('../views/MultiTaskView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
