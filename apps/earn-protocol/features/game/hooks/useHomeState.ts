import { useEffect, useState } from 'react'

import { startMusic, stopMusic } from '@/features/game/helpers/musicHelper'
import { type CardData } from '@/features/game/types'

export function useHomeState() {
  const [startingGame, setStartingGame] = useState(false)
  const [screenName, setScreenName] = useState<'start' | 'game' | 'ai' | 'over'>('start')
  const [lastScore, setLastScore] = useState(0)
  const [lastStreak, setLastStreak] = useState(0)
  const [lastRounds, setLastRounds] = useState(0)
  const [lastWasAI, setLastWasAI] = useState(false)
  const [showHow, setShowHow] = useState(false)
  const [lastResponseTimes, setLastResponseTimes] = useState<number[]>([])
  const [lastCards, setLastCards] = useState<CardData[] | undefined>(undefined)
  const [lastSelected, setLastSelected] = useState<number | null>(null)
  const [lastAvgResponse, setLastAvgResponse] = useState<number | undefined>(undefined)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (screenName === 'game' || screenName === 'ai') {
      startMusic()
    } else {
      stopMusic()
    }
  }, [screenName])

  const handleGameOver = (params: {
    score: number
    streak: number
    rounds: number
    lastCards?: CardData[]
    lastSelected?: number | null
    avgResponse?: number
    responseTimes?: number[]
    timedOut?: boolean
  }) => {
    setLastScore(params.score)
    setLastStreak(params.streak)
    setLastRounds(params.rounds)
    setLastCards(params.lastCards)
    setLastSelected(params.lastSelected ?? null)
    setLastAvgResponse(params.avgResponse)
    setTimedOut(!!params.timedOut)
    setScreenName('over')
    setLastResponseTimes(params.responseTimes ?? [])
  }

  return {
    screenName,
    setScreenName,
    lastScore,
    setLastScore,
    lastStreak,
    setLastStreak,
    lastRounds,
    setLastRounds,
    lastWasAI,
    setLastWasAI,
    showHow,
    setShowHow,
    lastCards,
    setLastCards,
    lastSelected,
    setLastSelected,
    lastAvgResponse,
    lastResponseTimes,
    setLastAvgResponse,
    timedOut,
    setTimedOut,
    handleGameOver,
    startingGame,
    setStartingGame,
  }
}
