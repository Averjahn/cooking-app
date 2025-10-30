<script setup lang="ts">
import { ref, watchEffect } from 'vue'

interface Props {
  modelValue: 'all' | 'fav'
  allLabel?: string
  favLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  allLabel: 'Search',
  favLabel: 'Favorites'
})
const emit = defineEmits<{ (e:'update:modelValue', v:'all'|'fav'): void }>()

const value = ref<Props['modelValue']>(props.modelValue)
watchEffect(() => emit('update:modelValue', value.value))
</script>

<template>
  <div class="tabs">
    <button :class="['tab', { 'tab--active': value==='all' }]" @click="value='all'">
      {{ allLabel }}
    </button>
    <button :class="['tab', { 'tab--active': value==='fav' }]" @click="value='fav'">
      {{ favLabel }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 12px;
  padding: 8px 16px;
}

.tab {
  padding: 12px 24px;
  border: 2px solid var(--ink);
  border-radius: 18px;
  background: #fff;
  color: var(--ink);
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--shadow);
}

.tab--active {
  background: #e8c7c7;
}
</style>


