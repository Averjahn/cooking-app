import type { Recipe } from '../types/recipes'
import { useLanguageStore } from '../stores/language'

const SAMPLEAPI_URL = 'https://api.sampleapis.com/coffee/hot'

// Опциональный переводчик (LibreTranslate-совместимый)
const translateEndpoint = import.meta.env.VITE_TRANSLATE_ENDPOINT as string | undefined
const translateKey = import.meta.env.VITE_TRANSLATE_KEY as string | undefined

async function translate(text: string, target: string): Promise<string> {
  if (!translateEndpoint) return text
  // Нормализуем код ('ru-RU' -> 'ru')
  const tl = target.toLowerCase().split('-')[0]
  try {
    const res = await fetch(translateEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(translateKey ? { Authorization: `Bearer ${translateKey}` } : {})
      },
      body: JSON.stringify({ q: text, source: 'auto', target: tl, format: 'text' })
    })
    if (!res.ok) return text
    const data: any = await res.json()
    return data?.translatedText || text
  } catch {
    return text
  }
}

export async function fetchCoffeeRecipesFromApi(): Promise<Recipe[] | null> {
  try {
    const res = await fetch(SAMPLEAPI_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const items: any[] = await res.json()
    const langStore = useLanguageStore()
    const lang = langStore.currentLanguage

    // Ограничим до 12 карточек для производительности
    const sliced = items.slice(0, 12)

    const result: Recipe[] = []
    for (const it of sliced) {
      const title = await translate(String(it.title ?? 'Coffee'), lang)
      const description = await translate(String(it.description ?? ''), lang)
      result.push({
        id: Number(it.id) || Math.random(),
        title,
        description,
        image: String(it.image ?? '☕'),
        steps: [
          { type: 'ingredients', text: 'Ingredients', ingredients: (it.ingredients || []).map((n: string) => ({ name: n, icon: '🫘' })), buttons: ['OK'] },
          { type: 'step', text: title, buttons: ['OK'] }
        ]
      })
    }
    return result
  } catch (e) {
    return null
  }
}


