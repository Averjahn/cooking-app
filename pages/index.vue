<template>
    <div>
      <div v-if="recipe" class="recipe-title">{{ recipe.title }}</div>
      <div v-if="currentStep">
        <TaskStep :step="currentStep" @complete="onStepComplete" />
      </div>
      <div class="final-words" v-else>
        Рецепт завершён! Приятного аппетита!
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import TaskStep from '@/components/TaskStep.vue'
  
  const recipe = ref(null)
  const currentStepIndex = ref(0)
  
  const currentStep = computed(() => recipe.value?.steps[currentStepIndex.value])
  
  onMounted(async () => {
    recipe.value = await $fetch('/api/recipe')
  })
  
  const onStepComplete = (stepId) => {
    if (currentStepIndex.value < recipe.value.steps.length - 1) {
      currentStepIndex.value++
    } else {
      currentStepIndex.value = null
    }
  }
  </script>
  <style scoped>
  .recipe-title{
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 30px;
    font-family: "Open Sans", sans-serif;
    color: rgb(210, 158, 85);
    font-size: 38px;
    padding: 30px;
  }

  .final-words{
    font-size: 32px;
    color: rgb(255, 203, 136);
    margin-top: 18vh;
  }
  </style>
  
  