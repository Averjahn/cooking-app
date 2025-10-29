<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import HomeView from './views/HomeView.vue'
import RecipeList from './components/RecipeList.vue'
import RecipePlayer from './components/RecipePlayer.vue'
import ErudaDebugger from './components/ErudaDebugger.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useTelegramUserStore } from './stores/telegramUser'
import { useRecipesStore } from './stores/recipes'
import { useLanguageStore } from './stores/language'
import { useI18n } from './composables/useI18n'

// Используем Pinia store
const telegramUserStore = useTelegramUserStore()
const recipesStore = useRecipesStore()
const languageStore = useLanguageStore()
const { t } = useI18n()

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
        // Инициализируем язык из Telegram
        languageStore.initLanguage(userData.language_code)
      } else {
        telegramUserStore.enableTestMode()
        // Инициализируем язык по умолчанию
        languageStore.initLanguage()
      }

    } else {
      telegramUserStore.enableTestMode()
      // Инициализируем язык по умолчанию
      languageStore.initLanguage()
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
        <p>{{ t('app.initialization') }}</p>
      </div>
    </div>

    <!-- Основное содержимое -->
    <div v-else class="app-container">
      <!-- Хедер приложения -->
      <header v-if="!hasActiveRecipe" class="app-header">
        <div class="app-header-top">
          <div class="app-icon">☕</div>
          <LanguageSwitcher />
        </div>
        <h1 class="app-title">{{ t('app.title') }}</h1>
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
            <h2>{{ t('recipes.multiTaskRecipe') }}: {{ recipesStore.currentMultiTaskRecipe.title }}</h2>
            <p>{{ t('recipes.inDevelopment') }}</p>
            <button @click="recipesStore.setAnyRecipe(null)" class="back-button">
              {{ t('recipes.backToList') }}
            </button>
          </div>
        </div>
      </div>

      <nav v-if="!hasActiveRecipe" class="app-navigation">
        <button 
          @click="currentView = 'profile'"
          :class="['app-nav-button', { 'app-nav-button--active': currentView === 'profile' }]"
        >
          <span>{{ t('navigation.profile') }}</span>
        </button>

        <button 
          @click="currentView = 'recipes'"
          :class="['app-nav-button', { 'app-nav-button--active': currentView === 'recipes' }]"
        >
          <span>{{ t('navigation.recipes') }}</span>
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

/* Индикатор загрузки - Черно-белый стиль */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border: 4px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
  color: #000;
  font-family: 'Courier New', monospace;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #000;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #000;
  font-size: 16px;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Основная структура - Винтажный стиль с теплыми цветами */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5ebe0;
  color: #3d2817;
  box-sizing: border-box;
  font-family: 'Courier New', 'Courier', monospace;
  position: relative;
}

/* Текстура фона - зернистость */
.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  background-image: 
    radial-gradient(circle at 20% 50%, transparent 20%, rgba(61, 40, 23, 0.02) 21%, rgba(61, 40, 23, 0.02) 34%, transparent 35%),
    radial-gradient(circle at 60% 50%, transparent 20%, rgba(61, 40, 23, 0.02) 21%, rgba(61, 40, 23, 0.02) 34%, transparent 35%),
    radial-gradient(circle at 40% 80%, transparent 20%, rgba(61, 40, 23, 0.02) 21%, rgba(61, 40, 23, 0.02) 34%, transparent 35%);
  background-size: 4px 4px, 3px 3px, 5px 5px;
  background-position: 0 0, 2px 2px, 1px 1px;
  pointer-events: none;
  z-index: 0;
}

/* Дополнительная текстура - линии */
.app-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      #3d2817 2px,
      #3d2817 4px
    );
  pointer-events: none;
  z-index: 0;
}

.app-container > * {
  position: relative;
  z-index: 1;
}

/* Заголовок приложения - Винтажный стиль */
.app-header {
  padding: 40px 20px 20px;
  text-align: center;
  width: 100%;
  background: #f5ebe0;
  border-bottom: 4px solid #3d2817;
  position: relative;
}

/* Текстура для заголовка */
.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233d2817' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.app-header > * {
  position: relative;
  z-index: 1;
}

.app-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 20px;
}

.app-icon {
  font-size: 4rem;
  margin-bottom: 0;
  filter: none;
  background: #3d2817;
  color: #f5ebe0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #3d2817;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  position: relative;
}

/* Текстура для иконки */
.app-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(245, 235, 224, 0.1) 2px,
      rgba(245, 235, 224, 0.1) 4px
    );
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #3d2817;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-family: 'Courier New', monospace;
  border: 3px solid #3d2817;
  padding: 1rem 2rem;
  display: inline-block;
  background: #f5ebe0;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  position: relative;
}

/* Текстура для заголовка */
.app-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.1) 1px, transparent 1px);
  background-size: 4px 4px;
  pointer-events: none;
}

.app-title p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

/* Нижняя навигация — мобильное меню - Винтажный стиль */
.app-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #f5ebe0;
  border-top: 4px solid #3d2817;
  z-index: 1000;
  padding: 0;
  box-shadow: 0 -4px 0 rgba(61, 40, 23, 0.6);
  position: relative;
}

/* Текстура для навигации */
.app-navigation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(61, 40, 23, 0.05) 40px,
      rgba(61, 40, 23, 0.05) 41px
    );
  pointer-events: none;
  z-index: 0;
}

/* Кнопки меню */
.app-nav-button {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: #3d2817;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-right: 2px solid #3d2817;
  position: relative;
  z-index: 1;
}

.app-nav-button:last-child {
  border-right: none;
}

.app-nav-button:hover {
  background: rgba(61, 40, 23, 0.1);
}

.app-nav-button--active {
  background: #3d2817;
  color: #f5ebe0;
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


/* Временное сообщение - Винтажный стиль */
.temp-message {
  text-align: center;
  padding: 2rem;
  color: #3d2817;
  background: #f5ebe0;
  border: 4px solid #3d2817;
  margin: 2rem;
  box-shadow: 6px 6px 0 rgba(61, 40, 23, 0.6);
  font-family: 'Courier New', monospace;
  position: relative;
}

/* Текстура для сообщения */
.temp-message::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background-image: 
    radial-gradient(circle, rgba(61, 40, 23, 0.1) 1px, transparent 1px);
  background-size: 3px 3px;
  pointer-events: none;
}

.temp-message h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.temp-message p {
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.back-button {
  padding: 12px 24px;
  background: #3d2817;
  border: 2px solid #3d2817;
  border-radius: 0;
  color: #f5ebe0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 rgba(61, 40, 23, 0.6);
  position: relative;
  z-index: 1;
}

.back-button:hover {
  background: #523825;
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 rgba(61, 40, 23, 0.6);
}
</style>
