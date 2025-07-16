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
import { Card, Icon, Text } from '@summerfi/app-earn-ui'
import { type IconNamesList } from '@summerfi/app-types'
import Link from 'next/link'

import { useScreenSize } from '@/hooks/use-screen-size'

import bigProtocolScrollerStyles from '@/components/layout/LandingPageContent/components/BigProtocolScroller.module.css'

type BigProtocolScrollerTrackProps = {
  children: ReactNode
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
}

type BigProtocolScrollerItemProps = {
  label: string
  labelIcon: ReactNode
  value: [string, string][]
  url?: string
}

type BigProtocolScrollerProps = {
  itemsList: {
    protocolIcon: IconNamesList
    protocol: string
    blocks: [string, string][]
    url?: string
  }[]
  animationPixelPerSecond?: number
}

const BigProtocolScrollerTrack = forwardRef<HTMLDivElement, BigProtocolScrollerTrackProps>(
  ({ children, style }, ref) => {
    return (
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerOverflowWrapper}>
        <div className={bigProtocolScrollerStyles.bigProtocolScrollerTrackWrapper}>
          <div className={bigProtocolScrollerStyles.bigProtocolScrollerOverlay} />
          <div
            className={bigProtocolScrollerStyles.bigProtocolScrollerTrack}
            ref={ref}
            style={style}
          >
            {children}
          </div>
        </div>
      </div>
    )
  },
)

const BigProtocolScrollerItem = ({
  labelIcon,
  label,
  value,
  url,
}: BigProtocolScrollerItemProps) => {
  const grid = useMemo(() => {
    return value.map(([key, value]) => (
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataBlock} key={key}>
        <Text variant="p4semi" as="p">
          {key}
        </Text>
        <Text variant="p2semi" as="span">
          {value}
        </Text>
      </div>
    ))
  }, [value])

  const insides = (
    <Card className={bigProtocolScrollerStyles.bigProtocolScrollerItem}>
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemNameIcon}>
        <Icon iconName={labelIcon as IconNamesList} size={44} />
        <Text variant="p1semi">{label}</Text>
      </div>
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataGrid}>{grid}</div>
    </Card>
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

export const BigProtocolScroller = ({
  itemsList,
  animationPixelPerSecond = 30,
}: BigProtocolScrollerProps) => {
  const { screenSize } = useScreenSize()
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // 570 is the width of the item, 16 is the gap
  const singleProtocolListWidth = itemsList.length * (570 + 16)

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
    <div className={bigProtocolScrollerStyles.bigProtocolScrollerWrapper}>
      <BigProtocolScrollerTrack
        ref={trackRef}
        style={{
          animationDuration: `${animationSpeedInSeconds}s`,
          animationPlayState: hovered ? 'paused' : 'running',
        }}
      >
        {protocolsListToDisplay.map(({ protocol, protocolIcon, url, blocks }, index) => (
          <BigProtocolScrollerItem
            key={`${protocol}-${index}`}
            label={protocol}
            url={url}
            labelIcon={protocolIcon}
            value={blocks}
          />
        ))}
      </BigProtocolScrollerTrack>
    </div>
  )
}
