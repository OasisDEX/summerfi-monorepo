'use client'

import styles from './StartScreen.module.css'

interface StartScreenProps {
  onStart: () => void
  onHowToPlay: () => void
  onAI: () => void
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onHowToPlay, onAI }) => {
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
        Can you beat the AI?
      </div>
      <button className={styles.button} onClick={handleStartClick}>
        Start Game
      </button>
      <button className={styles.button} onClick={onAI} style={{ marginTop: 12 }}>
        let the AI play for you
      </button>
      <button className={styles.buttonHowTo} onClick={handleHowToPlayClick}>
        How to Play
      </button>
    </div>
  )
}

export default StartScreen
