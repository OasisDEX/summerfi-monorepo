'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGameLogic } from '@/features/game/hooks/useGameLogic'
import { type GameOverParams } from '@/features/game/types'

import AIStatus from './AIStatus'
import AvgResponse from './AvgResponse'
import CardList from './CardList'
import FlyingApy from './FlyingApy'
import FlyingPercentSign from './FlyingPercentSign' // Import the new component
import ScoreBar from './ScoreBar'
import StreakAnimation from './StreakAnimation'
import StreakBar from './StreakBar'
import TimerBar from './TimerBar'

import styles from './GameScreen.module.css'

interface GameScreenProps {
  isAI: boolean
  onGameOver: (params: GameOverParams) => void
  onReturnToMenu: () => void
}

// Interface for flying percent sign state
interface FlyingPercentSignState {
  id: number
  startX: number
  startY: number
  color: string
  rotation: number
  size: number
  distance: number
}

const GameScreen: React.FC<GameScreenProps> = ({ isAI, onGameOver, onReturnToMenu }) => {
  const game = useGameLogic({ isAI, onGameOver })
  // State for flying percent signs
  const [flyingPercentSigns, setFlyingPercentSigns] = useState<FlyingPercentSignState[]>([])
  const [percentSignIdCounter, setPercentSignIdCounter] = useState(0)

  // Handler for removing completed percent sign animations
  const handleFlyingPercentSignComplete = useCallback((id: number) => {
    setFlyingPercentSigns((prev) => prev.filter((sign) => sign.id !== id))
  }, [])

  // Memoize fade-in style for the message and button
  const fadeIn = useMemo(
    () => ({
      opacity: isAI && game.round >= 20 ? 1 : 0,
      transition: 'opacity 0.8s',
      pointerEvents: (isAI && game.round >= 20
        ? 'auto'
        : 'none') as React.CSSProperties['pointerEvents'],
    }),
    [isAI, game.round],
  )

  // Effect: Create explosion of percent signs whenever a flying APY is added
  useEffect(() => {
    if (game.flyingApys.length > 0) {
      const lastFlyingApy = game.flyingApys[game.flyingApys.length - 1]
      const existingIds = flyingPercentSigns.map((sign) => sign.id)

      // Only create new percent signs if we haven't already created them for this APY
      if (!existingIds.includes(-lastFlyingApy.id)) {
        // Calculate time-based scaling factors
        // Normalized time left (0 to 1 range)
        const timeRatio = game.timeLeft / game.timer

        // Scale the particle count based on time left - more time = more particles
        // Base: 6-8 particles, Max: 16-20 particles
        const baseParticleCount = 6 + Math.floor(Math.random() * 3)
        const maxParticleCount = 16 + Math.floor(Math.random() * 5)
        const numSigns = Math.floor(
          Number(baseParticleCount + (maxParticleCount - baseParticleCount)) * timeRatio,
        )

        // Scale particle size based on time left - more time = bigger particles
        // Base size multiplier: 0.5-0.7, Max size multiplier: 1.0-1.5
        const baseSizeMultiplier = 0.5 + Number(Math.random() * 0.2)
        const maxSizeMultiplier = 1.0 + Number(Math.random() * 0.5)
        const sizeMultiplier =
          Number(baseSizeMultiplier + (maxSizeMultiplier - baseSizeMultiplier)) * timeRatio

        const newSigns: FlyingPercentSignState[] = []

        for (let i = 0; i < numSigns; i++) {
          // Create unique ID that's tied to the APY ID to prevent duplicate explosions
          const newId = percentSignIdCounter + i

          // Generate parameters for this percent sign
          const rotation = Math.random() * 360 // Random direction
          const size = (0.4 + Number(Math.random() * 0.6)) * sizeMultiplier // Random size scaled by time
          const distance = (60 + Number(Math.random() * 100)) * (0.8 + Number(timeRatio * 0.6)) // Random distance scaled by time

          // Use same color as APY but with some variation
          let { color } = lastFlyingApy

          if (Math.random() > 0.6) {
            const hue = Math.floor(Math.random() * 360)

            color = `hsl(${hue}, 70%, ${65 + Number(timeRatio * 15)}%)` // Brighter colors for faster responses
          }

          newSigns.push({
            id: newId,
            startX: lastFlyingApy.x,
            startY: lastFlyingApy.y,
            color,
            rotation,
            size,
            distance,
          })
        }

        // Batch state updates
        setFlyingPercentSigns((prev) => [
          ...prev,
          ...newSigns,
          {
            id: -lastFlyingApy.id, // Negative APY ID as marker
            startX: 0,
            startY: 0,
            color: 'transparent',
            rotation: 0,
            size: 0,
            distance: 0,
          },
        ])
        setPercentSignIdCounter((prev) => prev + numSigns)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.flyingApys, game.timeLeft, game.timer])

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
        cardRefs={game.cardRefs}
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

      {/* Render Flying Percent Sign components */}
      {flyingPercentSigns.map(
        (sign) =>
          // Only render visible percent signs (not the marker IDs)
          sign.id > 0 && (
            <FlyingPercentSign
              key={sign.id}
              id={sign.id}
              startX={sign.startX}
              startY={sign.startY}
              color={sign.color}
              rotation={sign.rotation}
              size={sign.size}
              distance={sign.distance}
              onComplete={handleFlyingPercentSignComplete}
            />
          ),
      )}

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
            Go back
          </button>
        </div>
      )}
    </div>
  )
}

export default GameScreen
