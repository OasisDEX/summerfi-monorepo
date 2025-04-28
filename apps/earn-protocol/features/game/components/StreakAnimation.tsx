import styles from './StreakAnimation.module.css'

interface StreakAnimationProps {
  angle?: number
  offsetX?: number
  offsetY?: number
  scale?: number
  label?: string
  color?: string
}

const StreakAnimation: React.FC<StreakAnimationProps> = ({
  angle = 0,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  label = 'PERFECT!',
  color = '#ffb300',
}) => (
  <div
    className={styles.streakAnimationWrapper}
    style={{
      top: `calc(80px + ${offsetY}px)`,
      left: `calc(50% + ${offsetX}px)`,
      position: 'absolute',
      transform: `translate(-50%, 0) rotate(${angle}deg) scale(${scale})`,
      pointerEvents: 'none',
    }}
  >
    <div className={styles.streakAnimation} style={{ color }}>
      {label}
    </div>
  </div>
)

export default StreakAnimation
