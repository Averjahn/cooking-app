<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let eruda: any = null

onMounted(() => {
  // Инициализируем Eruda для отладки
  try {
    import('eruda').then((module) => {
      eruda = module.default
      eruda.init()
      console.log('✅ Eruda отладчик загружен')
    }).catch((error) => {
      console.error('❌ Не удалось загрузить Eruda:', error)
    })
  } catch (error) {
    console.log('Eruda недоступен в production')
  }
})

onUnmounted(() => {
  if (eruda) {
    eruda.destroy()
  }
})
</script>

<template>
  <div style="display: none;"></div>
</template> 
