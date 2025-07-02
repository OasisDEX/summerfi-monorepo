'use client'

import { useEffect } from 'react'
import {
  Button,
  Card as UiCard,
  getTwitterShareUrl,
  Icon,
  Text,
  Tooltip,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'

import { type CardData } from '@/features/game/types'
import { trackGameFinished } from '@/helpers/mixpanel'
import { useUserWallet } from '@/hooks/use-user-wallet'

import Card from './Card'

import styles from './GameOverScreen.module.css'

interface GameOverScreenProps {
  score: number
  rounds: number
  isAI: boolean
  onRestart: () => void
  onAI?: () => void
  lastCards?: CardData[]
  lastSelected?: number | null
  avgResponse?: number
  responseTimes?: number[]
  timedOut?: boolean
  onReturnToMenu: () => void
  startingGame?: boolean // Optional prop to indicate if the game is starting
}

const getShareMessage = (score: number, avgResponse: number) => {
  return `I've scored ${score} points with an average response time of ${Math.floor(Number(avgResponse) * 1000) / 1000}s in Yield Racer! 🏎️💨

Can you beat my score?
https://summer.fi/earn#game
#SummerFi #YieldRacer
`
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  rounds,
  isAI,
  onRestart,
  onAI,
  lastCards,
  lastSelected,
  avgResponse,
  responseTimes,
  timedOut,
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Button variant="primaryLarge" onClick={onRestart} disabled={startingGame}>
          Try again
          <Icon iconName="user" size={16} />
        </Button>
        <Button variant="primaryLargeColorful" onClick={onAI} disabled={startingGame}>
          Try again, but with AI
          <Icon iconName="checkmark" size={16} />
        </Button>
      </div>
      <Text variant="h3colorful" style={{ margin: '60px 0 30px 0' }}>
        Challenge others to beat your score!
      </Text>
      <div className={styles.actionables}>
        <div className={styles.buttonsColumn}>
          <Tooltip
            showAbove
            tooltipId="submit-leaderboard-tooltip"
            tooltipWrapperStyles={{
              zIndex: 1000,
              width: '300px',
              top: '-80px',
              padding: 0,
            }}
            tooltip={
              <Text variant="p4semi">
                You will need to sign a message containing the response times (base of your score).
              </Text>
            }
          >
            <Button variant="secondaryLarge">
              Submit to the leaderboard
              <Icon iconName="rays" size={24} />
            </Button>
          </Tooltip>
          <Link
            href={getTwitterShareUrl({
              url: '',
              text: getShareMessage(score, avgResponse ?? 0),
            })}
            target="_blank"
          >
            <Button variant="secondaryLarge">
              Share your score
              <Icon iconName="social_x_beach_club" size={24} />
            </Button>
          </Link>
          <Button variant="secondaryLarge" onClick={onReturnToMenu} disabled={startingGame}>
            Return
            <Icon iconName="arrow_backward" size={16} />
          </Button>
        </div>
        <div className={styles.shareScoreBox}>
          <UiCard style={{ flexDirection: 'column', whiteSpace: 'pre-wrap' }}>
            {getShareMessage(score, avgResponse ?? 0)}
          </UiCard>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen
