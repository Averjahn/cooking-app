<script setup lang="ts">
import { useTelegramUserStore } from '../stores/telegramUser'
import { useI18n } from '../composables/useI18n'

// Используем Pinia store
const telegramUserStore = useTelegramUserStore()
const { t } = useI18n()
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
            {{ telegramUserStore.userName || t('profile.user') }}
          </h2>
          
          <p v-if="telegramUserStore.user?.username" class="user-username">
            @{{ telegramUserStore.user.username }}
          </p>
        </div>



        <!-- Статус -->
        <div v-if="telegramUserStore.isTestMode" class="user-status">
          <span class="status-badge test">
            {{ t('profile.testMode') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Сообщение об отсутствии данных -->
    <div v-else-if="!telegramUserStore.isLoading" class="no-data-message">
      <div class="no-data-icon">⚠️</div>
      <h3>{{ t('app.userNotFound') }}</h3>
      <p>{{ t('app.userNotFoundSubtext') }}</p>
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
  background: #fff;
  border-radius: 0;
  padding: 2rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8);
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 4px solid #000;
  font-family: 'Courier New', monospace;
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
  border-radius: 0;
  background: #000;
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
}

.user-info {
  margin-bottom: 1.5rem;
}

.user-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.user-username {
  color: #000;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Courier New', monospace;
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
  background: #000;
  color: #fff;
  border: 2px solid #000;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.no-data-message {
  text-align: center;
  color: #000;
  padding: 2rem;
  background: #fff;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.8);
  font-family: 'Courier New', monospace;
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
