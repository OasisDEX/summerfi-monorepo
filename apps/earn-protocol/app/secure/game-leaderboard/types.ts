import { type JsonValue } from '@summerfi/summer-protocol-db'

export type GameEntry = {
  ens: string
  gameId: string
  isBanned: boolean
  responseTimes: JsonValue
  score: string
  signedMessage: string
  updatedAt: string
  userAddress: string
  gamesPlayed: number
}

export type SacScore = {
  score: number
  explanation: string
  mean?: number
  stdDev?: number
}
