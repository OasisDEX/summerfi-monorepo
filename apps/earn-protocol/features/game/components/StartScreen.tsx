'use client'

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
      <h1 className={styles.title}>APY Game</h1>
      <div className={styles.description}>
        Click the card with the highest APY before time runs out!
        <br />
        <br />
        Can you beat the AI?
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <button className={styles.button} onClick={handleStartClick}>
          Start
        </button>
        or
        <button className={styles.button} onClick={onAI}>
          let the AI play it for you
        </button>
      </div>
      <button className={styles.buttonHowTo} onClick={handleHowToPlayClick}>
        How to Play
      </button>
      <button className={clsx(styles.button, styles.buttonClose)} onClick={closeGame}>
        Close the game
      </button>
    </div>
  )
}

export default StartScreen
