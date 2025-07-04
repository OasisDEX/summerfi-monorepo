import { createHmac } from 'crypto'

import { MINIMUM_ROUND_TIME, STARTING_ROUND_TIME } from '@/features/game/helpers/constants'
import { type CardData, type GameOverParams } from '@/features/game/types'

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

export function getRandomToken(): string {
  const tokens = ['ETH', 'USDC', 'USDT', 'EURC']

  return tokens[Math.floor(Math.random() * tokens.length)]
}

export function generateCards(round: number): CardData[] {
  const roundBasedCardCount = round <= 15 ? 3 : round <= 30 ? 6 : 9
  const cards: CardData[] = []

  while (cards.length < roundBasedCardCount) {
    const apy = Number((Number(Math.random() * 18) + 2).toFixed(2))

    if (cards.every((card) => Math.abs(card.apy - apy) >= 0.01)) {
      cards.push({
        apy,
        trendData: getTrendDataForAPY(apy),
        token: getRandomToken(),
      })
    }
  }

  return cards
}

export const startGameBackend = async (walletAddress: string) => {
  try {
    const response = await fetch(`/earn/api/game/${walletAddress}/start`)

    if (!response.ok) {
      throw new Error(`Error fetching game ID: ${response.statusText}`)
    }
    const data = await response.json()

    return data.gameId
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch game ID:', error)

    throw error
  }
}

export const finishGameBackend = async ({
  walletAddress,
  score,
  gameData,
  gameId,
}: {
  walletAddress: string
  score: number
  gameData: string
  gameId?: string
}) => {
  try {
    const response = await fetch(`/earn/api/game/${walletAddress}/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        gameData,
        gameId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error finishing game: ${response.statusText}`)
    }
    const data = await response.json()

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to finish game:', error)

    throw error
  }
}

export const hashGameData = (responseTimes: number[], gameId: string): string => {
  const hmac = createHmac('sha256', gameId)
  const data = responseTimes.join(',')

  hmac.update(data)
  const digest = hmac.digest('hex')
  // Store both the digest and the data (encrypted), separated by a delimiter
  // This is not encryption, just integrity check. For actual encryption, use a cipher.
  const encoded = Buffer.from(data).toString('base64')

  return `${digest}:${encoded}`
}

export const unhashGameData = (hashed: string, gameId: string): number[] => {
  const [digest, encoded] = hashed.split(':')

  if (!digest || !encoded) throw new Error(`Invalid hash format: ${hashed}`)
  const data = Buffer.from(encoded, 'base64').toString()
  const hmac = createHmac('sha256', gameId)

  hmac.update(data)
  const checkDigest = hmac.digest('hex')

  if (checkDigest !== digest) throw new Error('Hash mismatch')

  return data.split(',').map(Number)
}

export const prepareBackendGameData = (params: GameOverParams, gameId: string) => {
  if (!params.responseTimes) {
    throw new Error('Response times are required to prepare game data')
  }
  const hashedGameData = hashGameData(
    params.responseTimes.length ? params.responseTimes : [4],
    gameId,
  )

  return hashedGameData
}

export function calculateFinalScore(responseTimes: number[]): number {
  let totalScore = 0

  for (const responseTime of responseTimes) {
    const points = Math.floor(Number(100 * (2 - responseTime)) + 10)

    totalScore += points
  }

  return totalScore
}

export function getRoundTime(round: number): number {
  // The round time decreases every round by 0.1 seconds, starting from STARTING_ROUND_TIME seconds
  // and the minimum round time is MINIMUM_ROUND_TIME seconds
  const baseTime = STARTING_ROUND_TIME
  const timeDecrease = 0.1 * (round - 1)
  const roundTime = baseTime - timeDecrease

  return Math.max(roundTime, MINIMUM_ROUND_TIME)
}

export const medianScoreMakesSenseCheck = (responseTimes: number[]): boolean => {
  if (responseTimes.length === 0) return false

  const median = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length

  // Check if the median response time is humanly possible
  return median > 0.3
}

export const scoreMakesSenseCheck = ({
  score,
  backendScore,
}: {
  score: number | string
  backendScore: number
}) => {
  if (Number(score) < 0) {
    // If the score is negative, it doesn't make sense
    return false
  }

  if (backendScore !== Number(score)) {
    // If the backend score doesn't match the provided score, it doesn't make sense
    return false
  }

  return true
}

export const roundsMakeSenseCheck = (responseTimes: number[]): boolean => {
  const roundsCount = responseTimes.length
  const roundTimes = Array.from({ length: roundsCount }, (_, i) => getRoundTime(i + 1))

  if (roundsCount === 0) {
    // If there are no rounds we assume the game is lost immediately
    return true
  }

  for (let i = 0; i < roundsCount; i++) {
    if (responseTimes[i] > roundTimes[i]) {
      // If the response time exceeds the round time, it doesn't make sense
      return false
    }
  }

  return true
}

export const getMessageToSign = ({ score, gameId }: { score: number | string; gameId: string }) =>
  `Yield Racer - Submitting my score of ${score} points - ${gameId}`
