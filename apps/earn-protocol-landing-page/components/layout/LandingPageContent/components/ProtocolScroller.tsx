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
import { GradientBox, Icon, type IconNamesList, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { Emphasis } from '@/components/layout/LandingPageContent'
import { useScreenSize } from '@/hooks/use-screen-size'

import protocolScrollerStyles from './ProtocolScroller.module.scss'

type ProtocolScrollerTrackProps = {
  children: ReactNode
  ref: RefObject<HTMLDivElement>
  style: CSSProperties
}
type ProtocolScrollerItemProps = {
  protocolIcon: ReactNode
  protocol: string
  tvl: string
  url: string
}

export type ProtocolScrollerProps = {
  protocolsList?: {
    protocol: string
    protocolIcon: IconNamesList
    tvl: string
    url: string
  }[]
  animationPixelPerSecond?: number
}

const ProtocolScrollerTrack = forwardRef<HTMLDivElement, ProtocolScrollerTrackProps>(
  ({ children, style }, ref) => {
    return (
      <div className={protocolScrollerStyles.protocolScrollerOverflowWrapper}>
        <div className={protocolScrollerStyles.protocolScrollerTrackWrapper}>
          <div className={protocolScrollerStyles.protocolScrollerOverlay} />
          <div className={protocolScrollerStyles.protocolScrollerTrack} ref={ref} style={style}>
            {children}
          </div>
        </div>
      </div>
    )
  },
)

const ProtocolScrollerItem = ({ protocolIcon, protocol, tvl, url }: ProtocolScrollerItemProps) => {
  const [itemHovered, setItemHovered] = useState(false)

  const handleMouseOver = () => {
    setItemHovered(true)
  }

  const handleMouseLeave = () => {
    setItemHovered(false)
  }

  return (
    <Link href={url}>
      <GradientBox
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        selected={itemHovered}
        withHover
        className={protocolScrollerStyles.protocolScrollerItemGradient}
      >
        <div className={protocolScrollerStyles.protocolScrollerItem}>
          <div className={protocolScrollerStyles.protocolScrollerItemNameIcon}>
            {protocolIcon}
            <Text variant="p1semi">{protocol}</Text>
          </div>
          <div className={protocolScrollerStyles.protocolScrollerItemTvl}>
            <Text variant="p3semi">TVL</Text>
            <Text variant="p2semi">{tvl}</Text>
          </div>
        </div>
      </GradientBox>
    </Link>
  )
}

export const ProtocolScroller = ({
  protocolsList,
  animationPixelPerSecond = 20,
}: ProtocolScrollerProps) => {
  const { screenSize } = useScreenSize()
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // 280 is the width of the item, 16 is the gap
  const singleProtocolListWidth = (protocolsList?.length ?? 0) * (280 + 16)

  const protocolsListToDisplay = useMemo(() => {
    if (!protocolsList) return null
    // we need to get a list that will fill the whole screen horizontally
    // as the items in the scroller are fixed width + fixed gap we dont need to measure them
    const itemsListMultiplier = Math.ceil(screenSize.width / singleProtocolListWidth) * 2 // always at least two lists

    return Array.from({ length: itemsListMultiplier }).flatMap(() => protocolsList)
  }, [protocolsList, screenSize.width, singleProtocolListWidth])

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

  return protocolsListToDisplay ? (
    <div className={protocolScrollerStyles.protocolScrollerWrapper}>
      <Text variant="h3" as="p" className={protocolScrollerStyles.protocolScrollerHeader}>
        Automated access to <Emphasis variant="h3colorful">DeFi&apos;s best protocols</Emphasis>,
        with over 15Bn of total liquidity
      </Text>
      <ProtocolScrollerTrack
        ref={trackRef}
        style={{
          animationDuration: `${animationSpeedInSeconds}s`,
          animationPlayState: hovered ? 'paused' : 'running',
        }}
      >
        {protocolsListToDisplay.map(({ protocol, protocolIcon, tvl, url }, index) => (
          <ProtocolScrollerItem
            key={`${protocol}-${index}`}
            protocol={protocol}
            protocolIcon={<Icon iconName={protocolIcon} />}
            tvl={tvl}
            url={url}
          />
        ))}
      </ProtocolScrollerTrack>
    </div>
  ) : null
}
