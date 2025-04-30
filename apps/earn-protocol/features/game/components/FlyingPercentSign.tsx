import { useEffect, useState } from 'react'

import styles from './FlyingPercentSign.module.css'

interface FlyingPercentSignProps {
  id: number
  startX: number
  startY: number
  color: string
  rotation: number
  size: number
  distance: number
  onComplete: (id: number) => void
}

const FlyingPercentSign: React.FC<FlyingPercentSignProps> = ({
  id,
  startX,
  startY,
  color,
  rotation,
  size,
  distance,
  onComplete,
}) => {
  const [targetStyle, setTargetStyle] = useState({})

  useEffect(() => {
    // Calculate direction and distance
    const angle = rotation * (Math.PI / 180) // Convert rotation to radians
    const targetX = Math.cos(angle) * distance
    const targetY = Math.sin(angle) * distance
    const targetRotation = rotation + Number(Math.random() * 360) - 180 // Additional rotation during animation

    // Set the target transform as a CSS variable
    setTargetStyle({
      '--target-transform': `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) 
                             rotate(${targetRotation}deg) scale(${size})`,
    })

    // Set timeout to match animation duration
    const timer = setTimeout(() => {
      onComplete(id)
    }, 1000) // Animation duration

    return () => clearTimeout(timer)
  }, [id, rotation, distance, size, onComplete])

  return (
    <div
      className={styles.flyingPercentSign}
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        color,
        ...targetStyle,
      }}
    >
      %
    </div>
  )
}

export default FlyingPercentSign
