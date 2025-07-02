export function calculateFinalScore(responseTimes: number[]): number {
  let totalScore = 0

  for (const responseTime of responseTimes) {
    const points = Math.floor(Number(100 * (2 - responseTime)) + 10)

    totalScore += points
  }

  return totalScore
}
