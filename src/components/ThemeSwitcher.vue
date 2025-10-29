<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useI18n } from '../composables/useI18n'

const themeStore = useThemeStore()
const { t } = useI18n()

const isCoffee = computed(() => themeStore.currentTheme === 'coffee')
const toggle = () => {
  themeStore.setTheme(isCoffee.value ? 'classic' : 'coffee')
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try { window.Telegram.WebApp.HapticFeedback.selectionChanged() } catch {}
  }
}
</script>

<template>
  <button class="theme-button" @click="toggle" :aria-label="t('common.change')">
    <span class="icon">{{ isCoffee ? '☕' : '🎨' }}</span>
    <span class="label">{{ isCoffee ? 'Coffee' : 'Classic' }}</span>
  </button>
  
</template>

<style scoped>
.theme-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border: 2px solid var(--ink);
  background: var(--btn-bg);
  color: var(--btn-fg);
  border-radius: 0;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--shadow);
  font-family: 'Courier New', monospace;
}
.theme-button:hover { filter: brightness(0.95) }
.icon { font-size: 1.1rem }
.label { text-transform: uppercase; letter-spacing: 1px }
</style>


