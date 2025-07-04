import { useEffect, useState } from 'react'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { playGameStartSound } from '@/features/game/helpers/audioHelpers'
import {
  finishGameBackend,
  prepareBackendGameData,
  startGameBackend,
} from '@/features/game/helpers/gameHelpers'
import { startMusic, stopMusic } from '@/features/game/helpers/musicHelper'
import { type CardData, type GameOverParams } from '@/features/game/types'
import { useUserWallet } from '@/hooks/use-user-wallet'

export function useHomeState() {
  const { setRunningGame } = useSystemConfig()
  const { userWalletAddress } = useUserWallet()
  const [gameId, setGameId] = useState<string | undefined>(undefined)
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined)
  const [currentHighScore, setCurrentHighScore] = useState<number | undefined>(undefined)
  const [startingGame, setStartingGame] = useState(false)
  const [screenName, setScreenName] = useState<'start' | 'game' | 'ai' | 'over'>('start')
  const [lastScore, setLastScore] = useState(0)
  const [lastStreak, setLastStreak] = useState(0)
  const [lastRounds, setLastRounds] = useState(0)
  const [lastWasAI, setLastWasAI] = useState(false)
  const [showHow, setShowHow] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
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

  const handleStartGame = (isAI: boolean) => {
    playGameStartSound() // Play sound when starting the game
    setStartingGame(true)
    if (isAI || !userWalletAddress) {
      setTimeout(() => {
        setStartingGame(false)
        setScreenName(isAI ? 'ai' : 'game')
        setLastWasAI(isAI)
      }, 1000)

      return null
    }
    startGameBackend(userWalletAddress)
      .then((backendGameData) => {
        if (backendGameData.gameId) {
          setStartingGame(false)
          setGameId(backendGameData.gameId)
          setReferralCode(backendGameData.referralCode)
          setCurrentHighScore(backendGameData.currentHighScore)
          setScreenName('game')
          setLastWasAI(isAI)
          setRunningGame?.(true) // Set running game to true
        } else {
          setStartingGame(false)
          // eslint-disable-next-line no-console
          console.error('Failed to get game ID')
        }
      })
      .catch((error) => {
        setStartingGame(false)
        setScreenName('game')
        // eslint-disable-next-line no-console
        console.error('Error fetching game ID:', error)
      })

    return null
  }

  const handleGameOver = (params: GameOverParams) => {
    setScreenName('over')
    if (userWalletAddress && gameId) {
      finishGameBackend({
        walletAddress: userWalletAddress,
        score: params.score,
        gameData: prepareBackendGameData(params, gameId),
        gameId,
      })
        .then(() => {
          setLastScore(params.score)
          setLastStreak(params.streak)
          setLastRounds(params.rounds)
          setLastCards(params.lastCards)
          setLastSelected(params.lastSelected ?? null)
          setLastAvgResponse(params.avgResponse)
          setTimedOut(!!params.timedOut)
          setLastResponseTimes(params.responseTimes ?? [])
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error finishing game:', error)
        })
    } else {
      setLastScore(params.score)
      setLastStreak(params.streak)
      setLastRounds(params.rounds)
      setLastCards(params.lastCards)
      setLastSelected(params.lastSelected ?? null)
      setLastAvgResponse(params.avgResponse)
      setTimedOut(!!params.timedOut)
      setLastResponseTimes(params.responseTimes ?? [])
    }
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
    showLeaderboard,
    setShowLeaderboard,
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
    handleStartGame,
    startingGame,
    setStartingGame,
    gameId,
    setGameId,
    referralCode,
    currentHighScore,
  }
}
