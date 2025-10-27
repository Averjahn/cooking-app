<!--
  Компонент для подключения Eruda (инструменты разработчика для мобильных устройств)
  Загружается только в режиме разработки или при необходимости отладки
-->

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Загружаем Eruda для отладки на мобильных устройствах
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/eruda'
  script.onload = () => {
    if ((window as any).eruda) {
      (window as any).eruda.init()
    }
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div></div>
</template>
