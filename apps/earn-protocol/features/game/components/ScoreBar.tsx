import clsx from 'clsx'

import styles from './ScoreBar.module.css'

interface ScoreBarProps {
  score: number
  streak: number
  streakAnim: boolean
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, streakAnim }) => (
  <div className={styles.scoreBar}>
    <p className={clsx(styles.streak, streakAnim && styles.streakFadeOut)}>&nbsp;+5 streak!</p>
    Score: {score}
  </div>
)

export default ScoreBar
