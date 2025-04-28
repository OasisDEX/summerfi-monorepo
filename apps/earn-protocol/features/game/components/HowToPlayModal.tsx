import styles from './HowToPlayModal.module.css'

interface HowToPlayModalProps {
  onClose: () => void
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <h2 className={styles.title}>How to Play</h2>
      <ul className={styles.list}>
        <li>Click the card with the highest APY before time runs out.</li>
        <li>Correct answers earn points (faster = more points).</li>
        <li>Wrong answers end the game.</li>
        <li>Streaks of 2+ correct answers give bonus points.</li>
        <li>Game gets faster each round.</li>
        <li>&quot;Watch AI Play&quot; to see a perfect run!</li>
      </ul>
      <button className={styles.closeBtn} onClick={onClose}>
        Close
      </button>
    </div>
  </div>
)

export default HowToPlayModal
