'use client'

import {
  type CSSProperties,
  forwardRef,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { useScreenSize } from '@/hooks/use-screen-size'

import historyScrollerStyles from '@/components/layout/LandingPageContent/components/HistoryScroller.module.css'

type HistoryScrollerTrackProps = {
  children: ReactNode
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
}

type HistoryScrollerItemProps = {
  date: string
  title: string
  description: string
  url?: string
}

type HistoryScrollerProps = {
  itemsList: HistoryScrollerItemProps[]
  animationPixelPerSecond?: number
}

const HistoryScrollerTrack = forwardRef<HTMLDivElement, HistoryScrollerTrackProps>(
  ({ children, style }, ref) => {
    return (
      <div className={historyScrollerStyles.historyScrollerOverflowWrapper}>
        <div className={historyScrollerStyles.historyScrollerTrackWrapper}>
          <div className={historyScrollerStyles.historyScrollerOverlay} />
          <div className={historyScrollerStyles.historyScrollerTrack} ref={ref} style={style}>
            {children}
          </div>
        </div>
      </div>
    )
  },
)

const HistoryScrollerItem = ({ date, title, description, url }: HistoryScrollerItemProps) => {
  const insides = (
    <div className={historyScrollerStyles.historyScrollerItem}>
      <Text variant="p1semiColorful">{date}</Text>
      <Text variant="h5" as="h5">
        {title}
      </Text>
      <Text variant="p2" as="p">
        {description}
      </Text>
    </div>
  )

  if (!url) {
    return insides
  }

  return (
    <Link href={url} prefetch={false}>
      {insides}
    </Link>
  )
}

export const HistoryScroller = ({
  itemsList,
  animationPixelPerSecond = 30,
}: HistoryScrollerProps) => {
  const { screenSize } = useScreenSize()
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // 520 is the width of the item, 16 is the gap
  const singleProtocolListWidth = itemsList.length * (520 + 16)

  const protocolsListToDisplay = useMemo(() => {
    // we need to get a list that will fill the whole screen horizontally
    // as the items in the scroller are fixed width + fixed gap we dont need to measure them
    const itemsListMultiplier = Math.ceil(screenSize.width / singleProtocolListWidth) * 2 // always at least two lists

    return Array.from({ length: itemsListMultiplier }).flatMap(() => itemsList)
  }, [itemsList, screenSize.width, singleProtocolListWidth])

  const animationSpeedInSeconds = useMemo(() => {
    return Math.ceil(singleProtocolListWidth / animationPixelPerSecond)
  }, [singleProtocolListWidth, animationPixelPerSecond])

  useLayoutEffect(() => {
    // handle trackRef.current hover
    if (!trackRef.current) return () => {}
    const track = trackRef.current

    const handleMouseEnter = () => {
      setHovered(true)
    }

    const handleMouseLeave = () => {
      setHovered(false)
    }

    track.addEventListener('mouseenter', handleMouseEnter)
    track.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      track.removeEventListener('mouseenter', handleMouseEnter)
      track.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hovered])

  return (
    <div className={historyScrollerStyles.historyScrollerWrapper}>
      <HistoryScrollerTrack
        ref={trackRef}
        style={{
          animationDuration: `${animationSpeedInSeconds}s`,
          animationPlayState: hovered ? 'paused' : 'running',
        }}
      >
        {protocolsListToDisplay.map(({ date, description, title, url }, index) => (
          <HistoryScrollerItem
            key={`${date}-${description}-${title}-${index}`}
            date={date}
            description={description}
            title={title}
            url={url}
          />
        ))}
      </HistoryScrollerTrack>
    </div>
  )
}
