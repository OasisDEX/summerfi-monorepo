'use client'

import { useGameLogic } from '@/features/game/hooks/useGameLogic'
import { type CardData } from '@/features/game/types'

import AIStatus from './AIStatus'
import AvgResponse from './AvgResponse'
import CardList from './CardList'
import FlyingApy from './FlyingApy' // Import the new component
import ScoreBar from './ScoreBar'
import StreakAnimation from './StreakAnimation'
import StreakBar from './StreakBar'
import TimerBar from './TimerBar'

import styles from './GameScreen.module.css'

interface GameScreenProps {
  isAI: boolean
  onGameOver: (params: {
    score: number
    streak: number
    rounds: number
    lastCards?: CardData[]
    lastSelected?: number | null
    avgResponse?: number
    timedOut?: boolean
  }) => void
  onReturnToMenu: () => void // Add this prop
}

const GameScreen: React.FC<GameScreenProps> = ({ isAI, onGameOver, onReturnToMenu }) => {
  const game = useGameLogic({ isAI, onGameOver })

  // Fade-in style for the message and button
  const fadeIn = {
    opacity: isAI && game.round >= 20 ? 1 : 0,
    transition: 'opacity 0.8s',
    pointerEvents: (isAI && game.round >= 30
      ? 'auto'
      : 'none') as React.CSSProperties['pointerEvents'],
  }

  return (
    <div className={styles.container}>
      <ScoreBar score={game.score} streak={game.streak} streakAnim={game.streakAnim} />
      <StreakBar streak={game.streak} round={game.round} streakAnim={game.streakAnim} />
      <AvgResponse
        isAI={game.isAI}
        validResponses={game.validResponses}
        avgResponse={game.avgResponse}
      />
      <CardList
        cards={game.cards}
        selected={game.selected}
        isAI={game.isAI}
        onSelect={game.handleSelect}
        cardRefs={game.cardRefs} // Pass the refs down to CardList
      />
      <TimerBar timeLeft={game.timeLeft} timer={game.timer} />
      {game.isAI && <AIStatus />}
      {game.streakAnim && game.streak >= 2 && <StreakAnimation {...game.streakAnimProps} />}

      {/* Render Flying APY components */}
      {game.flyingApys.map((apy) => (
        <FlyingApy
          key={apy.id}
          id={apy.id}
          apy={apy.apy}
          startX={apy.x}
          startY={apy.y}
          color={apy.color}
          onComplete={game.handleFlyingApyComplete}
        />
      ))}

      {/* Fade-in message and button after 30 rounds in AI mode */}
      {isAI && (
        <div style={{ ...fadeIn, textAlign: 'center', marginTop: 32 }}>
          <div style={{ fontSize: 17, color: '#afafaf', marginBottom: 16 }}>
            The AI can keep playing endlessly, so feel free to take a break whenever you like.
          </div>
          <button
            style={{
              padding: '10px 24px',
              fontSize: 16,
              borderRadius: 8,
              background: '#222',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onReturnToMenu}
          >
            Return to Main Menu
          </button>
        </div>
      )}
    </div>
  )
}

export default GameScreen
