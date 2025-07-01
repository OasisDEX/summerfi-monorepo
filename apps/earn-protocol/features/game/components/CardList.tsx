/* eslint-disable no-mixed-operators */
import { memo, type RefObject, useEffect, useMemo, useState } from 'react'

import { type CardData } from '@/features/game/types'

import Card from './Card'

import styles from './CardList.module.css'

interface CardListProps {
  cards: CardData[]
  selected: number | null
  isAI: boolean
  onSelect: (idx: number, event: React.MouseEvent<HTMLDivElement>) => void
  cardRefs: RefObject<HTMLDivElement[]> // Add prop for refs array
}

const CardList: React.FC<CardListProps> = memo(({ cards, selected, isAI, onSelect, cardRefs }) => {
  const [aiCursorPosition, setAiCursorPosition] = useState({ x: 0, y: 0 })
  const [showAiCursor, setShowAiCursor] = useState(false)
  const ForwardRefCard = useMemo(
    () =>
      Card as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.ComponentProps<typeof Card>> &
          React.RefAttributes<HTMLDivElement>
      >,
    [],
  )

  // AI cursor movement logic
  useEffect(() => {
    if (!isAI || !cardRefs.current) return

    const highestApyIndex = cards.findIndex(
      (item) => item.apy === Math.max(...cards.map((c) => c.apy)),
    )
    const targetCard = cardRefs.current[highestApyIndex]

    if (!targetCard) return

    setShowAiCursor(true)

    // Get target card position
    const rect = targetCard.getBoundingClientRect()
    const randomOffsetX = (Math.random() - 0.5) * 70 // -20px to +20px
    const randomOffsetY = (Math.random() - 0.5) * 70 // -20px to +20px
    const targetX = rect.left + rect.width / 2 + randomOffsetX
    const targetY = rect.top + rect.height / 2 + randomOffsetY

    // Animate cursor movement
    const duration = 600 + Math.random() * 400
    const startTime = Date.now()
    const startX = aiCursorPosition.x || targetX + (Math.random() - 0.5) * 200
    const startY = aiCursorPosition.y || targetY + (Math.random() - 0.5) * 200

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth movement
      const easeProgress = 1 - (1 - progress) ** 3

      const currentX = startX + (targetX - startX) * easeProgress
      const currentY = startY + (targetY - startY) * easeProgress

      setAiCursorPosition({ x: currentX, y: currentY })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isAI, cards, cardRefs, selected])

  // Hide cursor when not in AI mode
  useEffect(() => {
    if (!isAI) {
      setShowAiCursor(false)
    }
  }, [isAI])

  return (
    <div className={styles.cardList}>
      {cards.map((card, i) => (
        <ForwardRefCard
          ref={(el: HTMLDivElement | null) => {
            if (cardRefs.current) {
              cardRefs.current[i] = el as HTMLDivElement
            }
          }}
          key={`${i}_${card.apy}`}
          data-card-index={i}
          apy={card.apy}
          token={card.token}
          trendData={card.trendData}
          selected={selected === i}
          onClick={(evt) => !isAI && onSelect(i, evt)}
          highlight={
            selected !== null &&
            i === cards.findIndex((item) => item.apy === Math.max(...cards.map((c) => c.apy)))
          }
          apyColor={(() => {
            if (card.apy >= 10) return '#1db954'
            if (card.apy <= 3) return '#d7263d'
            if (card.apy <= 5) return 'rgb(120,40,40)'

            return '#afafaf'
          })()}
        />
      ))}
      {/* AI Cursor */}
      {showAiCursor && isAI && (
        <div
          style={{
            position: 'fixed',
            left: aiCursorPosition.x - 12,
            top: aiCursorPosition.y - 4,
            width: '60px',
            height: '60px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff' stroke='%23000' stroke-width='1'%3E%3Cpath d='M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none',
            zIndex: 1000,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transition: 'none',
          }}
        />
      )}
    </div>
  )
})

export default CardList
