<template>
    <div class="recipe-view">
        <h2>{{ t('recipes.recipe') }}</h2>
        <p>{{ t('recipes.inDevelopment') }}</p>
        <button @click="$router.back()">{{ t('common.back') }}</button>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
</style>
  