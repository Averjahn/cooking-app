/**
 * Правильное склонение слова "шаг" в зависимости от количества
 * @param count - количество шагов
 * @returns правильная форма слова
 */
export const pluralizeStep = (count: number): string => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'шагов'
  }

  switch (lastDigit) {
    case 1:
      return 'шаг'
    case 2:
    case 3:
    case 4:
      return 'шага'
    default:
      return 'шагов'
  }
}
