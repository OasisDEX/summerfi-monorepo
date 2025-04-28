import styles from './TimerBar.module.css'

interface TimerBarProps {
  timeLeft: number
  timer: number
}

const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, timer }) => {
  const percent = (timeLeft / timer) * 100
  let barColor = '#4f8cff'

  if (percent < 33) barColor = '#ff4d4f'
  else if (percent < 66) barColor = '#ffb300'
  else barColor = '#1db954'

  return (
    <div className={styles.timerBarOuter}>
      <div className={styles.timerBarInner} style={{ width: `${percent}%`, background: barColor }}>
        <span className={styles.timerText}>{timeLeft.toFixed(2)}s</span>
      </div>
    </div>
  )
}

export default TimerBar
