import Card from '@/features/game/components/Card'

import styles from './HowToPlayModal.module.css'

interface HowToPlayModalProps {
  onClose: () => void
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <h2 className={styles.title}>How to Play</h2>
      <p>Click the card with the highest APY before time runs out.</p>
      <div className={styles.cardContainer}>
        <div className={styles.cardExample}>
          <Card
            token="ETH"
            apy={21.37}
            trendData={[
              { x: 1, y: 2 },
              { x: 2, y: 1 },
              { x: 3, y: 3 },
              { x: 4, y: 7 },
            ]}
            apyColor="#1db954"
          />
          <p className={styles.goodExample}>good</p>
        </div>
        <div className={styles.cardExample}>
          <Card
            token="ETH"
            apy={2.04}
            trendData={[
              { x: 1, y: 1 },
              { x: 2, y: 0 },
              { x: 3, y: 4 },
              { x: 4, y: 2 },
            ]}
            apyColor="#d7263d"
          />
          <p className={styles.badExample}>bad</p>
        </div>
        <div className={styles.cardExample}>
          <Card
            token="ETH"
            apy={7.35}
            trendData={[
              { x: 1, y: 7 },
              { x: 2, y: 3 },
              { x: 3, y: 5 },
              { x: 4, y: 1 },
            ]}
            apyColor="#d7263d"
          />
          <p className={styles.badExample}>bad</p>
        </div>
      </div>
      <p>Correct answers earn points.</p>
      <p>Select faster = more points.</p>
      <p>Wrong answers end the game.</p>
      <p>Streaks of 2+ correct answers give bonus points.</p>
      <p>Game gets faster each round.</p>
      <button className={styles.closeBtn} onClick={onClose}>
        Close
      </button>
    </div>
  </div>
)

export default HowToPlayModal
