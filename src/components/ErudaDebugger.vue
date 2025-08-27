<template>
  <div style="display: none;">
    <!-- Компонент не рендерит ничего видимого в DOM -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Инициализируем Eruda только в development режиме
  if (import.meta.env.DEV) {
    import('eruda').then((eruda) => {
      // Инициализируем Eruda
      eruda.default.init()
      
      // Настраиваем Eruda для лучшей работы с Telegram WebApp
      const erudaInstance = eruda.default.get()
      
      // Добавляем информацию о Telegram WebApp
      if (window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp
        
        // Создаем кастомную панель для Telegram данных
        erudaInstance.add({
          name: 'Telegram',
          tool: {
            render: () => {
              const div = document.createElement('div')
              div.innerHTML = `
                <div style="padding: 10px;">
                  <h4>Telegram WebApp Info</h4>
                  <p><strong>Platform:</strong> ${webApp.platform}</p>
                  <p><strong>Version:</strong> ${webApp.version}</p>
                  <p><strong>Color Scheme:</strong> ${webApp.colorScheme}</p>
                  <p><strong>Viewport Height:</strong> ${webApp.viewportHeight}</p>
                  <p><strong>Is Expanded:</strong> ${webApp.isExpanded}</p>
                  <hr>
                  <h4>User Data</h4>
                  ${webApp.initDataUnsafe.user ? `
                    <p><strong>ID:</strong> ${webApp.initDataUnsafe.user.id}</p>
                    <p><strong>Name:</strong> ${webApp.initDataUnsafe.user.first_name} ${webApp.initDataUnsafe.user.last_name || ''}</p>
                    <p><strong>Username:</strong> ${webApp.initDataUnsafe.user.username || 'N/A'}</p>
                  ` : '<p>No user data</p>'}
                  <hr>
                  <h4>Theme Params</h4>
                  <p><strong>BG Color:</strong> ${webApp.themeParams.bg_color || 'N/A'}</p>
                  <p><strong>Text Color:</strong> ${webApp.themeParams.text_color || 'N/A'}</p>
                  <p><strong>Button Color:</strong> ${webApp.themeParams.button_color || 'N/A'}</p>
                </div>
              `
              return div
            }
          }
        })
        
        // Добавляем кнопки для тестирования Telegram API
        erudaInstance.add({
          name: 'Telegram Tests',
          tool: {
            render: () => {
              const div = document.createElement('div')
              div.innerHTML = `
                <div style="padding: 10px;">
                  <h4>Telegram API Tests</h4>
                  <button onclick="window.Telegram.WebApp.expand()" style="margin: 5px; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px;">Expand App</button>
                  <button onclick="window.Telegram.WebApp.MainButton.setText('Test Button'); window.Telegram.WebApp.MainButton.show();" style="margin: 5px; padding:8px; background: #28a745; color: white; border: none; border-radius: 4px;">Show Main Button</button>
                  <button onclick="window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')" style="margin: 5px; padding: 8px; background: #ffc107; color: black; border: none; border-radius: 4px;">Haptic Feedback</button>
                  <button onclick="window.Telegram.WebApp.close()" style="margin: 5px; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px;">Close App</button>
                </div>
              `
              return div
            }
          }
        })
        
        console.log('Eruda initialized with Telegram WebApp support')
      } else {
        console.log('Eruda initialized (Telegram WebApp not available)')
      }
    }).catch((err) => {
      console.error('Failed to load Eruda:', err)
    })
  }
})
</script>
