<template>
    <div v-if="remaining > 0 && props.duration">
      Времени осталось: {{ formattedTime }}
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
  
  const props = defineProps({
    duration: {
      type: Number,
      required: true
    }
  })
  
  const emit = defineEmits(['complete'])
  
  const remaining = ref(props.duration)
  let timer = null
  
  const startTimer = () => {
    clearInterval(timer)
    if(props.duration){
        remaining.value = props.duration
        timer = setInterval(() => {
        if (remaining.value > 0) {
            remaining.value --
        } else {
            clearInterval(timer)
            emit('complete')
        }
    }, 1000)
    }
  }
  
  const formattedTime = computed(() => {
    const minutes = Math.floor(remaining.value / 60)
    const seconds = remaining.value % 60
    if(minutes === 0){
        return `${seconds} секунд`
    } else {
        return `${minutes} минут${minutes === 1 ? 'а' : ''} ${seconds} секунд`
    }
  })
  
  onMounted(() => {
    startTimer()
  })
  
  watch(() => props.duration, () => {
    startTimer()
  })
  
  onUnmounted(() => {
    clearInterval(timer)
  })
  </script>
  
  <style scoped>
  div {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }
  </style>
  
  