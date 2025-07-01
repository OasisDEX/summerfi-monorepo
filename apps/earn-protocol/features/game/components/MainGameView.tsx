'use client'

import { useCallback, useEffect } from 'react'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import GameOverScreen from '@/features/game/components/GameOverScreen'
import GameScreen from '@/features/game/components/GameScreen'
import HowToPlayModal from '@/features/game/components/HowToPlayModal'
import StartScreen from '@/features/game/components/StartScreen'
import { playGameStartSound } from '@/features/game/helpers/audioHelpers'
import { setMusicVolume, stopMusic } from '@/features/game/helpers/musicHelper'
import { useHomeState } from '@/features/game/hooks/useHomeState'

import mainGameViewStyles from './MainGameView.module.css'

export default function MainGameView() {
  const home = useHomeState()
  const { setRunningGame, runningGame } = useSystemConfig()

  const closeGame = useCallback(() => {
    setRunningGame?.(false) // Close game by setting runningGame to false
    home.setScreenName('start') // Reset to start screen
    home.setShowHow(false) // Hide how-to-play modal if open
  }, [home, setRunningGame])

  const handleEscape = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        closeGame()
      }
    },
    [closeGame],
  )

  useEffect(() => {
    document.querySelectorAll('body')[0].classList.add('no-scroll') // Prevent body scroll when modal is open
    window.addEventListener('keydown', handleEscape)

    return () => {
      stopMusic() // Stop music when component unmounts
      document.querySelectorAll('body')[0].classList.remove('no-scroll') // Re-enable body scroll
      window.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])

  useEffect(() => {
    if (home.screenName === 'game' || home.screenName === 'ai') {
      setMusicVolume(0.3) // Fade in music for gameplay
    } else {
      setMusicVolume(0.1) // Fade out music for menu/other screens (higher minimum)
    }
  }, [home.screenName])

  const startGame = (isAI: boolean) => {
    playGameStartSound() // Play sound when starting the game
    home.setStartingGame(true)
    setTimeout(() => {
      home.setStartingGame(false)
      home.setScreenName(isAI ? 'ai' : 'game')
      home.setLastWasAI(isAI)
    }, 1000)
  }

  if (!runningGame) {
    return null // Do not render anything if the game is not running
  }

  return (
    <div className={mainGameViewStyles.mainGameWrapper}>
      {home.screenName === 'start' && (
        <StartScreen
          onStart={() => startGame(false)} // Use startGame function
          onAI={() => startGame(true)}
          onHowToPlay={() => home.setShowHow(true)}
          startingGame={home.startingGame}
          closeGame={closeGame} // Close game function
        />
      )}
      {home.screenName === 'game' && (
        <GameScreen
          isAI={false}
          onGameOver={home.handleGameOver}
          onReturnToMenu={() => home.setScreenName('start')}
        />
      )}
      {home.screenName === 'ai' && (
        <GameScreen
          isAI
          onGameOver={home.handleGameOver}
          onReturnToMenu={() => home.setScreenName('start')}
        />
      )}
      {home.screenName === 'over' && (
        <GameOverScreen
          score={home.lastScore}
          streak={home.lastStreak}
          rounds={home.lastRounds}
          isAI={home.lastWasAI}
          lastCards={home.lastCards}
          lastSelected={home.lastSelected}
          avgResponse={home.lastAvgResponse}
          timedOut={home.timedOut}
          startingGame={home.startingGame}
          responseTimes={home.lastResponseTimes}
          onRestart={() => startGame(home.lastWasAI)} // Use startGame for restart
          onAI={() => startGame(true)} // Use startGame for starting AI game
          onReturnToMenu={() => home.setScreenName('start')}
          closeGame={closeGame} // Close game function
        />
      )}
      {home.showHow && <HowToPlayModal onClose={() => home.setShowHow(false)} />}
    </div>
  )
}
