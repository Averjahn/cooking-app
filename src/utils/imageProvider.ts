/**
 * Провайдер изображений кофе через Pixabay
 * Требуется ключ в Vite: VITE_PIXABAY_KEY
 */

const PIXABAY_ENDPOINT = 'https://pixabay.com/api/'

// Соответствие кодов языка между приложением и Pixabay
const mapLang = (lang: string): string => {
  const code = lang.toLowerCase().split('-')[0]
  const allowed = [
    'cs','da','de','en','es','fr','id','it','hu','nl','no','pl','pt','ro','sk','fi','sv','tr','vi','th','bg','ru','el','ja','ko','zh'
  ]
  return allowed.includes(code) ? code : 'en'
}

export async function fetchCoffeeImage(query: string, lang = 'en'): Promise<string | null> {
  const key = import.meta.env.VITE_PIXABAY_KEY as string | undefined
  if (!key) return null

  const url = new URL(PIXABAY_ENDPOINT)
  url.searchParams.set('key', key)
  url.searchParams.set('q', `${query} coffee`)
  url.searchParams.set('image_type', 'photo')
  url.searchParams.set('orientation', 'horizontal')
  url.searchParams.set('category', 'food')
  url.searchParams.set('per_page', '3')
  url.searchParams.set('lang', mapLang(lang))

  try {
    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data: any = await res.json()
    const hit = data.hits?.[0]
    return hit?.webformatURL || hit?.largeImageURL || null
  } catch {
    return null
  }
}


