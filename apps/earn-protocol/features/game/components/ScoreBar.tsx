import clsx from 'clsx'

import styles from './ScoreBar.module.css'

interface ScoreBarProps {
  score: number
  streak: number
  streakAnim: boolean
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, streak, streakAnim }) => (
  <div className={styles.scoreBar}>
    Score: {score}
    {streak >= 2 && (
      <span className={clsx(streakAnim ? styles.streakAnim : styles.streak)}>+5 streak!</span>
    )}
  </div>
)

export default ScoreBar
