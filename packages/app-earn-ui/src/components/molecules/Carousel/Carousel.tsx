'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './Carousel.module.css'

type CarouselProps = {
  components: ReactNode[]
  contentWidth: number
}

export const Carousel: FC<CarouselProps> = ({ components, contentWidth }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Required minimum distance between touch start and end to be detected as swipe
  const minSwipeDistance = 50

  useEffect(() => {
    return () => {
      setTouchStart(null)
      setTouchEnd(null)
    }
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleNext = () => {
    if (animating) return // Prevent multiple clicks during animation
    setAnimating(true)

    setActiveIndex((prevIndex) => (prevIndex + 1) % components.length)
    setTimeout(() => {
      setAnimating(false)
    }, 800)
  }

  const handlePrevious = () => {
    if (animating) return // Prevent multiple clicks during animation
    setAnimating(true)

    setActiveIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length)
    setTimeout(() => {
      setAnimating(false)
    }, 800)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.mobilePagination}>
        <button className={styles.mobileButton} onClick={handlePrevious} disabled={animating}>
          <Icon iconName="chevron_left" color="var(--color-neutral-10)" variant="s" />
        </button>
        <div className={styles.pips}>
          {components.map((_, index) => (
            <div
              key={index}
              className={`${styles.pip} ${index === activeIndex ? styles.pipActive : ''}`}
            />
          ))}
        </div>
        <button className={styles.mobileButton} onClick={handleNext} disabled={animating}>
          <Icon iconName="chevron_right" color="var(--color-neutral-10)" variant="s" />
        </button>
      </div>

      <div
        className={styles.carouselContent}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
          <Icon iconName="chevron_left" color="var(--color-neutral-10)" variant="xs" />
        </button>
        <button className={styles.buttonRight} onClick={handleNext} disabled={animating}>
          <Icon iconName="chevron_right" color="var(--color-neutral-10)" variant="xs" />
        </button>
      </div>
    </div>
  )
}
