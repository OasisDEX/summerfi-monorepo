import { type CardData } from '@/features/game/types'

export function getTrendDataForAPY(apy: number): { x: number; y: number }[] {
  const points = 20 // Increased from 8 to 20 for more detail
  let y = apy + 2 + Number(Math.random() * 2)
  const trend = apy >= 10 ? 1 : apy <= 3 ? -1 : 0.5

  return Array.from({ length: points }, (_, i) => {
    // Further increase randomness for even more jaggedness
    const jaggedness = (Math.random() - 0.5) * (apy < 5 ? 3.5 : 1.8) // more jagged

    y += Number(trend * (apy / 20)) + jaggedness
    y = Math.max(0, y)

    return { x: i, y: parseFloat(y.toFixed(2)) }
  })
}

export function generateCards(round: number): CardData[] {
  const roundBasedCardCount = round <= 15 ? 3 : round <= 30 ? 6 : 9
  const apys: number[] = []

  while (apys.length < roundBasedCardCount) {
    const newApy = Number((Number(Math.random() * 18) + 2).toFixed(2))

    if (apys.every((apy) => Math.abs(apy - newApy) >= 0.01)) {
      apys.push(newApy)
    }
  }

  return apys.map((apy) => ({ apy, trendData: getTrendDataForAPY(apy) }))
}
