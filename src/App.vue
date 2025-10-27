<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import HomeView from './views/HomeView.vue'
import RecipeList from './components/RecipeList.vue'
import RecipePlayer from './components/RecipePlayer.vue'
import ErudaDebugger from './components/ErudaDebugger.vue'
import { useTelegramUserStore } from './stores/telegramUser'
import { useRecipesStore } from './stores/recipes'

// Используем Pinia store
const telegramUserStore = useTelegramUserStore()
const recipesStore = useRecipesStore()

// Состояние навигации
const currentView = ref<'profile' | 'recipes'>('profile')

// Проверяем есть ли активный рецепт (любого типа)
const hasActiveRecipe = computed(() => {
  return recipesStore.currentRecipe || recipesStore.currentMultiTaskRecipe
})

// Инициализация при монтировании
onMounted(() => {
  setTimeout(() => {
    initTelegramApp()
  }, 100)
})

/**
 * Инициализация Telegram WebApp
 */
const initTelegramApp = async () => {
  try {
    telegramUserStore.setLoading(true)

    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      telegramUserStore.setWebApp(webApp)

      // Получаем данные пользователя
      let userData: any = null

      // Основной источник - initDataUnsafe.user
      if (webApp.initDataUnsafe.user) {
        userData = webApp.initDataUnsafe.user
      }

      // Альтернативный источник - initDataUnsafe.receiver (для ботов)
      if (!userData && webApp.initDataUnsafe.receiver) {
        userData = webApp.initDataUnsafe.receiver
      }

      // Если нет данных в initDataUnsafe, пытаемся парсить initData
      if (!userData && webApp.initData) {
        try {
          const params = new URLSearchParams(webApp.initData)
          const userParam = params.get('user')

          if (userParam) {
            try {
              const parsedUser = JSON.parse(decodeURIComponent(userParam))
              userData = parsedUser
            } catch (e) {
              // Тихая обработка ошибок парсинга
            }
          }
        } catch (e) {
          // Тихая обработка ошибок парсинга
        }
      }

      // Устанавливаем данные пользователя
      if (userData) {
        telegramUserStore.setUser(userData)
      } else {
        telegramUserStore.enableTestMode()
      }

    } else {
      telegramUserStore.enableTestMode()
    }

  } catch (err) {
    telegramUserStore.setError(`Ошибка: ${err}`)
    telegramUserStore.enableTestMode()
  } finally {
    telegramUserStore.setLoading(false)
  }
}

// Переключение между видами


</script>

<template>
  <div id="app">
    <!-- Индикатор загрузки -->
    <div v-if="telegramUserStore.isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Инициализация Telegram WebApp...</p>
      </div>
    </div>

    <!-- Основное содержимое -->
    <div v-else class="app-container">
      <!-- Хедер приложения -->
      <header v-if="!hasActiveRecipe" class="app-header">
        <div class="app-icon">👨‍🍳</div>
        <h1 class="app-title">Ваш персональный помощник в мире кулинарии</h1>
      </header>

      <!-- Контент -->
      <div :class="['content-area', { 'content-area--with-nav': !hasActiveRecipe }]">
        <HomeView v-if="currentView === 'profile'" />
        <div v-else>
          <!-- Если рецепт не выбран - показываем список -->
          <RecipeList v-if="!hasActiveRecipe" />
          <!-- Если выбран обычный рецепт - показываем пошаговое воспроизведение -->
          <RecipePlayer 
            v-else-if="recipesStore.currentRecipe" 
            :recipe="recipesStore.currentRecipe" 
          />
          <!-- Если выбран мульти-блочный рецепт - пока тоже показываем список (временно) -->
          <div v-else-if="recipesStore.currentMultiTaskRecipe" class="temp-message">
            <h2>Мульти-блочный рецепт: {{ recipesStore.currentMultiTaskRecipe.title }}</h2>
            <p>Компонент в разработке...</p>
            <button @click="recipesStore.setAnyRecipe(null)" class="back-button">
              ← Назад к списку
            </button>
          </div>
        </div>
      </div>

      <nav v-if="!hasActiveRecipe" class="app-navigation">
        <button 
          @click="currentView = 'profile'"
          :class="['app-nav-button', { 'app-nav-button--active': currentView === 'profile' }]"
        >
          <span>Профиль</span>
        </button>

        <button 
          @click="currentView = 'recipes'"
          :class="['app-nav-button', { 'app-nav-button--active': currentView === 'recipes' }]"
        >
          <span>Рецепты</span>
        </button>
        </nav>


      <!-- Компонент отладки -->
      <ErudaDebugger />
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow: hidden;
}

/* Индикатор загрузки */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: white;
  font-size: 16px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Основная структура */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-sizing: border-box;
}

/* Заголовок приложения */
.app-header {
  padding: 60px 20px 20px;
  text-align: center;
  width: 100%;
}

.app-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.app-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.app-title p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

/* Нижняя навигация — мобильное меню */
.app-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  z-index: 1000;
  padding: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
}

/* Кнопки меню */
.app-nav-button {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.app-nav-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.app-nav-button--active {
  background: rgba(255, 255, 255, 0.25);
}

/* Чтобы контент не скрывался за меню */
.content-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding-bottom: 60px; /* отступ под меню */
}


/* Временное сообщение */
.temp-message {
  text-align: center;
  padding: 2rem;
  color: white;
}

.temp-message h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.temp-message p {
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.back-button {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
