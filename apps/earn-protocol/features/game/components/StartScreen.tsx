'use client'

import { Button, Icon, Text } from '@summerfi/app-earn-ui'

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
      <h1 className={styles.title}>APY GAME</h1>
      <div className={styles.description}>
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
        <Button variant="primaryLarge" onClick={handleStartClick}>
          <span>Play</span>
          <Icon iconName="arrow_forward" size={16} />
        </Button>
        <Text variant="p1semiColorful">or</Text>
        <Button variant="primaryLargeColorful" onClick={onAI}>
          <span>let the AI play it for you</span>
          <Icon iconName="arrow_increase" size={16} />
        </Button>
        <Button variant="secondaryLarge" onClick={handleHowToPlayClick}>
          <span>How to Play</span>
          <Icon iconName="question_mark" size={16} />
        </Button>
        <Button variant="textPrimaryLarge" onClick={closeGame}>
          <span>Exit</span>
          <Icon iconName="close" size={16} />
        </Button>
      </div>
    </div>
  )
}

export default StartScreen
