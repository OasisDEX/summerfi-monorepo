'use client'

import { useCallback, useEffect, useState } from 'react'
import { useChain, useSignMessage, useSmartAccountClient } from '@account-kit/react'
import {
  accountType,
  Button,
  Card as UiCard,
  getTwitterShareUrl,
  Icon,
  LoadingSpinner,
  Text,
  Tooltip,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'

import { getMessageToSign } from '@/features/game/helpers/gameHelpers'
import { type GameOverParams } from '@/features/game/types'
import { trackGameFinished } from '@/helpers/mixpanel'

import Card from './Card'

import styles from './GameOverScreen.module.css'

interface GameOverScreenProps extends GameOverParams {
  isAI: boolean
  onRestart: () => void
  onAI?: () => void
  onReturnToMenu: () => void
  startingGame?: boolean
  gameId?: string
  onShowLeaderboard?: () => void
  referralCode?: string
  currentHighScore?: number
  isBanned?: boolean
  closeGame: () => void
}

const getShareMessage = (score: number, avgResponse: number, referralCode?: string) => {
  return `I've scored ${score} points with an average response time of ${Math.floor(Number(avgResponse) * 1000) / 1000}s in Yield Racer! 🏎️💨

Can you beat my score?

https://summer.fi/earn?game${referralCode ? `&referralCode=${referralCode}` : ''}

#SummerYieldRacer
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
  gameId,
  onShowLeaderboard,
  referralCode,
  currentHighScore,
  isBanned = false,
  closeGame,
}) => {
  const { client } = useSmartAccountClient({ type: accountType })
  const { signMessageAsync } = useSignMessage({
    client,
  })
  const { chain } = useChain()

  const [submittingToLeaderboard, setSubmittingToLeaderboard] = useState(false)
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorSigning, setErrorSigning] = useState(false)
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
      responseTimes,
      avgResponse,
      referralCode,
      gameId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submitToLeaderboard = useCallback(() => {
    if (!gameId) {
      return
    }
    setSubmittingToLeaderboard(true)
    setErrorSigning(false)
    signMessageAsync({
      message: getMessageToSign({ score, gameId }),
    })
      .then((signature) => {
        fetch(`/earn/api/game/${userWalletAddress}/leaderboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameId,
            signature,
            chainId: chain.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setSubmittingToLeaderboard(false)
            if (data.errorCode) {
              // eslint-disable-next-line no-console
              console.error('Error submitting to leaderboard:', data.errorCode)
              setLeaderboardError(`Error ${data.errorCode}`)

              return
            }
            setSubmitSuccess(true)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error submitting to leaderboard:', error)
            setLeaderboardError(`CODE_${error.code || 'UNKNOWN'}`)
            setSubmitSuccess(false)
            setSubmittingToLeaderboard(false)
          })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error signing message:', error)
        setSubmittingToLeaderboard(false)
        setErrorSigning(true)
      })
  }, [gameId, userWalletAddress, chain.id, score, signMessageAsync])

  const getLeaderboardIcon = useCallback(() => {
    if (submittingToLeaderboard) {
      return <LoadingSpinner size={16} />
    }
    if (submitSuccess) {
      return <Icon iconName="checkmark" size={16} />
    }
    if (leaderboardError) {
      return <Icon iconName="warning" size={16} />
    }

    return <Icon iconName="trophy" size={16} />
  }, [submittingToLeaderboard, submitSuccess, leaderboardError])

  const getLeaderboardLabel = useCallback(() => {
    if (errorSigning) {
      return 'Error signing message'
    }
    if (isBanned) {
      return 'You are banned from leaderboard'
    }
    if (currentHighScore && currentHighScore >= score) {
      return `Your High Score: ${currentHighScore}`
    }
    if (submittingToLeaderboard) {
      return 'Submitting...'
    }
    if (submitSuccess) {
      return 'Submitted to Leaderboard'
    }
    if (leaderboardError) {
      return `Error: ${leaderboardError}`
    }

    return 'Submit to Leaderboard'
  }, [
    submittingToLeaderboard,
    submitSuccess,
    leaderboardError,
    currentHighScore,
    score,
    isBanned,
    errorSigning,
  ])

  const isSubmitToLeaderboard = getLeaderboardLabel() === 'Submit to Leaderboard'

  return (
    <div
      className={clsx(styles.container, {
        [styles.starting]: startingGame,
      })}
    >
      <Text variant="h1" className={styles.title}>
        Game Over
      </Text>
      {timedOut === true ? <div className={styles.timedOut}>you ran out of time!</div> : null}
      <div className={styles.score}>
        {isAI ? 'AI Score' : 'You scored'} <b>{score}</b> points
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
      <div className={styles.tryAgainButtons}>
        <Button variant="primaryLarge" onClick={onRestart} disabled={startingGame}>
          Try again
          <Icon iconName="user" size={16} />
        </Button>
        <Button variant="primaryLargeColorful" onClick={onAI} disabled={startingGame}>
          Try again, but with AI
          <Icon iconName="checkmark" size={16} />
        </Button>
      </div>
      <Text variant="h3colorful" style={{ margin: '60px 0 10px 0', textAlign: 'center' }}>
        Challenge others to beat your score!
      </Text>
      <UiCard className={styles.actionables} variant="cardSecondary">
        <div className={styles.buttonsColumn}>
          {userWalletAddress ? (
            <Tooltip
              showAbove
              hideDrawerOnMobile
              tooltipId="submit-leaderboard-tooltip"
              tooltipWrapperStyles={{
                zIndex: 1000,
                width: '300px',
                top: '-80px',
                padding: 0,
              }}
              tooltip={
                currentHighScore && currentHighScore >= score ? (
                  <Text variant="p4semi">
                    Score {score} is below your current
                    <br />
                    high score of {currentHighScore} points.
                  </Text>
                ) : (
                  <Text variant="p4semi">
                    You will need to sign a message containing the response times (base of your
                    score).
                  </Text>
                )
              }
            >
              <Button
                variant="primaryLarge"
                disabled={
                  !gameId ||
                  !!submittingToLeaderboard ||
                  !!submitSuccess ||
                  isBanned ||
                  (!!currentHighScore && currentHighScore >= score)
                }
                className={clsx({
                  [styles.submitButtonAnimation]: isSubmitToLeaderboard,
                })}
                onClick={submitToLeaderboard}
              >
                {getLeaderboardLabel()}
                {getLeaderboardIcon()}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip
              showAbove
              hideDrawerOnMobile
              tooltipId="connect-leaderboard-tooltip"
              tooltipWrapperStyles={{
                zIndex: 1000,
                width: '300px',
                top: '-80px',
                padding: 0,
              }}
              tooltip={
                <Text variant="p4semi">
                  Go back to the main menu and connect
                  <br />
                  your wallet first, then play the game again.
                </Text>
              }
            >
              <Button variant="primaryLarge" disabled>
                Connect wallet to submit score
                <Icon iconName="wallet" size={16} />
              </Button>
            </Tooltip>
          )}
          <Button variant="secondaryLarge" onClick={onShowLeaderboard}>
            Check the leaderboard
            <Icon iconName="trophy" size={16} />
          </Button>
          <Link
            href={getTwitterShareUrl({
              url: '',
              text: getShareMessage(score, avgResponse ?? 0, referralCode),
            })}
            target="_blank"
          >
            <Button variant="secondaryLarge">
              Share your score
              <Icon iconName="social_x_beach_club" size={24} />
            </Button>
          </Link>
          <Button variant="secondaryLarge" onClick={onReturnToMenu} disabled={startingGame}>
            Go back
            <Icon iconName="arrow_backward" size={16} />
          </Button>
        </div>
        <div className={styles.shareScoreBox}>
          <UiCard style={{ flexDirection: 'column', whiteSpace: 'pre-wrap' }}>
            {getShareMessage(score, avgResponse ?? 0, referralCode)}
          </UiCard>
        </div>
      </UiCard>
      <Button variant="textPrimaryLarge" onClick={closeGame} style={{ marginTop: '20px' }}>
        <span>Close</span>
        <Icon iconName="close" size={16} />
      </Button>
    </div>
  )
}

export default GameOverScreen
