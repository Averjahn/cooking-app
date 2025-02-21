<template>
  <div class="task-step">
    <div class="step-description">{{ step.description }}</div>
    <Timer :duration="step.duration" @complete="onComplete" />
    <el-button type="primary" size="large" round @click="onComplete">
        Завершить шаг
    </el-button>
  </div>
</template>

<script setup>
const props = defineProps({
  step: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['complete'])

const onComplete = () => {
  emit('complete', props.step.id)
}
</script>

<style scoped>
.task-step {
  margin: 15px 0;
  min-height: 30vh;
  width: 40vw;
  padding: 35px;
  background: #00000084;
  border: 3px solid #4f4f4f50;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.step-description {
  font-size: 1.5em;
  margin-bottom: 40px;
  /* font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif; */
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  color: #ffffff;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background: #ffc400ba;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #0057b384;
}
</style>
