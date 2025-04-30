import styles from './StreakBar.module.css'

interface StreakBarProps {
  streak: number
  round: number
  streakAnim: boolean
}

const StreakBar: React.FC<StreakBarProps> = ({ streak, round, streakAnim }) => (
  <div
    className={styles.streakBar}
    style={{
      color: streakAnim ? '#ffb300' : '#555',
      fontWeight: streakAnim ? 700 : 400,
    }}
  >
    Streak: {streak} &nbsp;|&nbsp; Round: {round}
  </div>
)

export default StreakBar
