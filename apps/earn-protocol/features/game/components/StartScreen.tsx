'use client'

import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import styles from './StartScreen.module.css'

interface StartScreenProps {
  onStart: () => void
  onHowToPlay: () => void
  onAI: () => void
  closeGame: () => void
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onHowToPlay, onAI, closeGame }) => {
  const handleStartClick = () => {
    onStart()
  }

  const handleHowToPlayClick = () => {
    onHowToPlay()
  }

  return (
    <div className={styles.container}>
      <h1 className={clsx(styles.title, styles.animated)} style={{ animationDelay: '0.3s' }}>
        APY GAME
      </h1>
      <div className={clsx(styles.description, styles.animated)} style={{ animationDelay: '0.4s' }}>
        Click the card with the highest APY before time runs out!
        <br />
        Can you beat the AI?
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Button
          variant="primaryLarge"
          onClick={handleStartClick}
          className={styles.animated}
          style={{ animationDelay: '0.5s' }}
        >
          <span>Play</span>
          <Icon iconName="arrow_forward" size={16} />
        </Button>
        <Text
          variant="p1semiColorful"
          className={styles.animated}
          style={{ animationDelay: '0.6s' }}
        >
          or
        </Text>
        <Button
          variant="primaryLargeColorful"
          onClick={onAI}
          className={styles.animated}
          style={{ animationDelay: '0.7s' }}
        >
          <span>let the AI play it for you</span>
          <Icon iconName="arrow_increase" size={16} />
        </Button>
        <Button
          variant="secondaryLarge"
          onClick={handleHowToPlayClick}
          className={styles.animated}
          style={{ animationDelay: '0.8s' }}
        >
          <span>How to Play</span>
          <Icon iconName="question_mark" size={16} />
        </Button>
        <Button
          variant="textPrimaryLarge"
          onClick={closeGame}
          className={styles.animated}
          style={{ animationDelay: '0.9s' }}
        >
          <span>Exit</span>
          <Icon iconName="close" size={16} />
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
