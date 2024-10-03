import React, { useRef, useState } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './Carousel.module.scss'

type CarouselProps = {
  components: React.ReactNode[]
  contentHeight: number
  contentWidth: number
}

export const Carousel: React.FC<CarouselProps> = ({ components, contentHeight, contentWidth }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const ref = useRef()

  const handleNext = () => {
    if (animating) return // Prevent multiple clicks during animation
    setAnimating(true)

    setActiveIndex((prevIndex) => (prevIndex + 1) % components.length)
    setAnimating(false)
  }

  const handlePrevious = () => {
    if (animating) return // Prevent multiple clicks during animation
    setAnimating(true)

    setActiveIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length)
    setAnimating(false)
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselContent}>
        {components.map((component, index) => {
          let slideClass = styles.slide

          if (index === activeIndex) {
            slideClass = `${styles.slide} ${styles.slideActive}`
          } else if (index === (activeIndex + 1) % components.length) {
            slideClass = `${styles.slide} ${styles.slideRight}`
          } else if (index === (activeIndex - 1 + components.length) % components.length) {
            slideClass = `${styles.slide} ${styles.slideLeft}`
          }

          return (
            <div key={index} className={slideClass}>
              {component}
            </div>
          )
        })}
      </div>

      <div className={styles.carouselButtons} style={{ gap: contentWidth + 40 }}>
        <button className={styles.buttonLeft} onClick={handlePrevious} disabled={animating}>
          <Icon iconName="chevron_left" color="rgba(255, 251, 253, 1)" variant="xxs" />
        </button>
        <button className={styles.buttonRight} onClick={handleNext} disabled={animating}>
          <Icon iconName="chevron_right" color="rgba(255, 251, 253, 1)" variant="xxs" />
        </button>
      </div>
    </div>
  )
}
