import { memo, type RefObject, useMemo } from 'react'

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
  const ForwardRefCard = useMemo(
    () =>
      Card as React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.ComponentProps<typeof Card>> &
          React.RefAttributes<HTMLDivElement>
      >,
    [],
  )

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
    </div>
  )
})

export default CardList
