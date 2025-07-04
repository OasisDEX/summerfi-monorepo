'use client'

import { useCallback, useEffect } from 'react'

import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import GameOverScreen from '@/features/game/components/GameOverScreen'
import GameScreen from '@/features/game/components/GameScreen'
import HowToPlayModal from '@/features/game/components/HowToPlayModal'
import LeaderboardModal from '@/features/game/components/LeaderboardModal'
import StartScreen from '@/features/game/components/StartScreen'
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
    if (runningGame) {
      document.querySelectorAll('body')[0].classList.add('no-scroll') // Prevent body scroll when modal is open
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      if (runningGame) {
        stopMusic() // Stop music when component unmounts
        document.querySelectorAll('body')[0].classList.remove('no-scroll') // Re-enable body scroll
        window.removeEventListener('keydown', handleEscape)
      }
    }
  }, [handleEscape, runningGame])

  useEffect(() => {
    if (home.screenName === 'game' || home.screenName === 'ai') {
      setMusicVolume(0.3) // Fade in music for gameplay
    } else {
      setMusicVolume(0.1) // Fade out music for menu/other screens (higher minimum)
    }
  }, [home.screenName])

  if (!runningGame) {
    return null // Do not render anything if the game is not running
  }

  return (
    <div className={mainGameViewStyles.mainGameWrapper}>
      {home.screenName === 'start' && (
        <StartScreen
          onStart={() => home.handleStartGame(false)} // Use startGame function
          onAI={() => home.handleStartGame(true)}
          onHowToPlay={() => home.setShowHow(true)}
          onShowLeaderboard={() => home.setShowLeaderboard(true)} // Use handleGoToLeaderboard
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
          gameId={home.gameId}
          isAI={home.lastWasAI}
          lastCards={home.lastCards}
          lastSelected={home.lastSelected}
          avgResponse={home.lastAvgResponse}
          timedOut={home.timedOut}
          startingGame={home.startingGame}
          responseTimes={home.lastResponseTimes}
          currentHighScore={home.currentHighScore} // Pass current high score to GameOverScreen
          referralCode={home.referralCode} // Pass referral code to GameOverScreen
          onRestart={() => home.handleStartGame(home.lastWasAI)} // Use startGame for restart
          onAI={() => home.handleStartGame(true)} // Use startGame for starting AI game
          onReturnToMenu={() => home.setScreenName('start')}
          onShowLeaderboard={() => home.setShowLeaderboard(true)} // Use handleGoToLeaderboard
        />
      )}
      {home.showHow && <HowToPlayModal onClose={() => home.setShowHow(false)} />}
      {home.showLeaderboard && <LeaderboardModal onClose={() => home.setShowLeaderboard(false)} />}
    </div>
  )
}
