'use client'

import { useEffect } from 'react'
import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { type CardData } from '@/features/game/types'
import { trackGameFinished } from '@/helpers/mixpanel'
import { useUserWallet } from '@/hooks/use-user-wallet'

import Card from './Card'

import styles from './GameOverScreen.module.css'

interface GameOverScreenProps {
  score: number
  streak: number
  rounds: number
  isAI: boolean
  onRestart: () => void
  onAI?: () => void
  lastCards?: CardData[]
  lastSelected?: number | null
  avgResponse?: number
  timedOut?: boolean
  closeGame: () => void
  onReturnToMenu: () => void
  startingGame?: boolean // Optional prop to indicate if the game is starting
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  streak,
  rounds,
  isAI,
  onRestart,
  onAI,
  lastCards,
  lastSelected,
  avgResponse,
  timedOut,
  closeGame,
  onReturnToMenu,
  startingGame,
}) => {
  // Find the correct card index
  const correctIdx =
    lastCards && lastCards.length > 0
      ? lastCards.findIndex(
          (card) => card.apy === Math.max(...lastCards.map((lastCard) => lastCard.apy)),
        )
      : null

  const { userWalletAddress } = useUserWallet()

  useEffect(() => {
    trackGameFinished({
      id: 'GameFinished',
      page: window.location.host + window.location.pathname,
      userAddress: userWalletAddress,
      score,
      rounds,
      avgResponse,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={clsx(styles.container, {
        [styles.starting]: startingGame,
      })}
    >
      <h2 className={styles.title}>Game Over</h2>
      {timedOut === true ? <div className={styles.timedOut}>you ran out of time!</div> : null}
      <div className={styles.score}>
        {isAI ? 'AI Score' : 'Your Score'}: <b>{score}</b>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Rounds</div>
          <div className={styles.statValue}>{rounds}</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Best Streak</div>
          <div className={styles.statValue}>{streak}</div>
        </div>
        {typeof avgResponse === 'number' && avgResponse > 0 && (
          <div className={styles.statBox}>
            <div className={styles.statLabel}>Avg. Response</div>
            <div className={styles.statValue}>
              {avgResponse < 1
                ? `${Math.round(avgResponse * 1000)}ms`
                : `${avgResponse.toFixed(2)}s`}
            </div>
          </div>
        )}
      </div>
      {lastCards && lastCards.length > 0 && lastSelected !== null && lastSelected !== undefined ? (
        <div className={styles.lastCardsRow}>
          {lastCards.map((card, i) => (
            <div key={i} className={styles.lastCardCol}>
              <Card
                apy={card.apy}
                trendData={card.trendData}
                selected={lastSelected === i}
                highlight={i === correctIdx}
                token={card.token}
                apyColor={(() => {
                  if (card.apy >= 10) return '#1db954'
                  if (card.apy <= 3) return '#d7263d'
                  if (card.apy <= 5) return 'rgb(120,40,40)'

                  return '#afafaf'
                })()}
              />
              {lastSelected === i && <div className={styles.selectedLabel}>you selected</div>}
              {i === correctIdx && <div className={styles.bestApyLabel}>best APY</div>}
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.buttonsRow}>
        <Button variant="primaryLarge" onClick={onRestart}>
          Try getting a better score
          <Icon iconName="arrow_forward" size={16} />
        </Button>
        <Text variant="p1semiColorful">or</Text>
        <Button variant="primaryLargeColorful" onClick={onAI}>
          let the AI do the work
          <Icon iconName="arrow_increase" size={16} />
        </Button>
      </div>
      <div className={styles.buttonsRowOptions}>
        <Button variant="secondaryLarge" onClick={onReturnToMenu}>
          Return to Menu
          <Icon iconName="arrow_backward" size={16} />
        </Button>
        <Button variant="textPrimaryLarge" onClick={closeGame}>
          <span>Exit</span>
          <Icon iconName="close" size={16} />
        </Button>
      </div>
    </div>
  )
}

export default GameOverScreen
