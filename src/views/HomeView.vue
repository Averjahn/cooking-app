<script setup lang="ts">
import { useTelegramUserStore } from '../stores/telegramUser'

// Используем Pinia store
const telegramUserStore = useTelegramUserStore()
</script>

<template>
  <div class="home-container">
    <!-- Карточка пользователя -->
    <div v-if="telegramUserStore.isReady" class="user-card-container">
      <div class="user-card">
        <!-- Аватар пользователя -->
        <div class="user-avatar">
          <img 
            v-if="telegramUserStore.user?.photo_url" 
            :src="telegramUserStore.user.photo_url" 
            :alt="telegramUserStore.userName"
            class="avatar-image"
          />
          <div v-else class="avatar-fallback">
            {{ telegramUserStore.userInitial }}
          </div>
        </div>
        
        <!-- Основная информация -->
        <div class="user-info">
          <h2 class="user-name">
            {{ telegramUserStore.userName }}
          </h2>
          
          <p v-if="telegramUserStore.user?.username" class="user-username">
            @{{ telegramUserStore.user.username }}
          </p>
        </div>



        <!-- Статус -->
        <div v-if="telegramUserStore.isTestMode" class="user-status">
          <span class="status-badge test">
            🧪 Тестовый режим
          </span>
        </div>
      </div>
    </div>

    <!-- Сообщение об отсутствии данных -->
    <div v-else-if="!telegramUserStore.isLoading" class="no-data-message">
      <div class="no-data-icon">⚠️</div>
      <h3>Данные пользователя не найдены</h3>
      <p>Проверьте консоль браузера для отладочной информации</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.user-card-container {
  padding: 0 20px;
  width: 100%;
  max-width: 400px;
}

.user-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.user-avatar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.avatar-fallback {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.user-info {
  margin-bottom: 1.5rem;
}

.user-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.user-username {
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}



.user-status {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.test {
  background: #fed7d7;
  color: #742a2a;
}

.no-data-message {
  text-align: center;
  color: white;
  padding: 2rem;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-data-message h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.no-data-message p {
  margin: 0;
  opacity: 0.8;
}
</style>
