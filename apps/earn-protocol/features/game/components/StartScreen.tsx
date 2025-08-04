'use client'

import { Button, Card, Icon, Text, useUserWallet } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import WalletLabel from '@/components/molecules/WalletLabel/WalletLabel'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'

import styles from './StartScreen.module.css'

interface StartScreenProps {
  onStart: () => void
  onHowToPlay: () => void
  onAI: () => void
  closeGame: () => void
  startingGame?: boolean // Optional prop to indicate if the game is starting
  onShowLeaderboard?: () => void // Optional prop to show leaderboard
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onHowToPlay,
  onShowLeaderboard,
  onAI,
  closeGame,
  startingGame,
}) => {
  const { userWalletAddress } = useUserWallet()
  const { isGameByInvite } = useSystemConfig()

  return (
    <div
      className={clsx(styles.container, {
        [styles.starting]: startingGame,
      })}
    >
      <Text
        variant="h1"
        className={clsx(styles.title, styles.animated)}
        style={{ animationDelay: '0.3s' }}
      >
        Yield Racer 🏎️
      </Text>
      {isGameByInvite && (
        <Text
          variant="p1semiColorful"
          className={clsx(styles.inviteText, styles.animated)}
          style={{ animationDelay: '0.3s' }}
        >
          You have been challenged to play the Yield Racer!
        </Text>
      )}
      <div className={clsx(styles.description, styles.animated)} style={{ animationDelay: '0.4s' }}>
        Click the card with the highest APY before time runs out!
        <br />
        Can you beat the AI?
      </div>
      <div className={styles.wrapperCard}>
        <Card
          className={clsx(styles.animated, styles.wrapperCard)}
          style={{ animationDelay: '0.6s' }}
        >
          <div className={styles.wrapperCardButtons}>
            <Button
              variant="primaryLarge"
              onClick={onStart}
              style={{ maxWidth: 200, minWidth: 200 }}
            >
              <span>Play</span>
              <Icon iconName="arrow_forward" size={16} />
            </Button>
            <Text variant="p1semiColorful">or</Text>
            <Button
              variant="primaryLargeColorful"
              onClick={onAI}
              style={{ maxWidth: 200, minWidth: 200 }}
            >
              <span>Play with AI</span>
              <Icon iconName="arrow_increase" size={16} />
            </Button>
          </div>
          <div className={styles.wrapperCardButtons}>
            <Button
              variant="secondaryLarge"
              onClick={onHowToPlay}
              style={{ maxWidth: 200, minWidth: 200 }}
            >
              <span>How to Play</span>
              <Icon iconName="question_mark" size={16} />
            </Button>
            <Button
              variant="secondaryLarge"
              onClick={onShowLeaderboard}
              style={{ maxWidth: 200, minWidth: 200 }}
            >
              <span>Leaderboard</span>
              <Icon iconName="trophy" size={16} />
            </Button>
          </div>
        </Card>
        {!userWalletAddress ? (
          <Card
            className={clsx(styles.animated, styles.wrapperCard)}
            style={{ animationDelay: '0.7s' }}
          >
            <Text variant="p2semi">To save your score on the leaderboard</Text>
            <WalletLabel customLoginLabel="Connect your wallet" buttonVariant="primaryLarge" />
          </Card>
        ) : (
          <Card
            className={clsx(styles.animated, styles.wrapperCard)}
            variant="cardSecondary"
            style={{ animationDelay: '0.7s' }}
          >
            <Text variant="p2semiColorful" as="span">
              You&#39;re connected.
            </Text>
            <Text variant="p3" as="span">
              You will be able to save your score on the leaderboard.
            </Text>
          </Card>
        )}
        <Button
          variant="textPrimaryLarge"
          onClick={closeGame}
          className={styles.animated}
          style={{ animationDelay: '0.8s' }}
        >
          <span>Close</span>
          <Icon iconName="close" size={16} />
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
