import { useEffect, useState } from 'react'

import styles from './FlyingApy.module.css'

interface FlyingApyProps {
  id: number
  apy: number
  startX: number
  startY: number
  color: string
  onComplete: (id: number) => void
}

const FlyingApy: React.FC<FlyingApyProps> = ({ id, apy, startX, startY, color, onComplete }) => {
  const [targetStyle, setTargetStyle] = useState({})

  useEffect(() => {
    // Calculate random direction and distance
    const angle = Math.random() * Math.PI * 2 // Random angle in radians
    const distance = 150 + Number(Math.random() * 100) // Fly 150-250px
    const targetX = Math.cos(angle) * distance
    const targetY = Math.sin(angle) * distance
    const targetScale = 1.5 + Number(Math.random()) // Scale up 1.5x to 2.5x

    // Set the target transform as a CSS variable
    setTargetStyle({
      '--target-transform': `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${targetScale})`,
    })

    // Set timeout to match animation duration
    const timer = setTimeout(() => {
      onComplete(id)
    }, 800) // Matches animation duration in CSS

    return () => clearTimeout(timer)
  }, [id, onComplete])

  return (
    <div
      className={styles.flyingApy}
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        color,
        ...targetStyle,
      }}
    >
      {apy.toFixed(2)}%
    </div>
  )
}

export default FlyingApy
