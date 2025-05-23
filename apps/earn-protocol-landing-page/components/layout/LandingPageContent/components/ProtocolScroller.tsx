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
import { Emphasis, GradientBox, Icon, Text } from '@summerfi/app-earn-ui'
import {
  type LandingPageData,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
} from '@summerfi/app-types'
import { formatAsShorthandNumbers } from '@summerfi/app-utils'
import Link from 'next/link'

import { useScreenSize } from '@/hooks/use-screen-size'

import protocolScrollerStyles from '@/components/layout/LandingPageContent/components/ProtocolScroller.module.css'

type ProtocolScrollerTrackProps = {
  children: ReactNode
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
}
type ProtocolScrollerItemProps = {
  protocol: string
  protocolIcon: ReactNode
  tvl: bigint
  url: string
}

type ProtocolScrollerProps = {
  protocolTvls?: LandingPageData['protocolTvls']
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

  const insides = (
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
          <Text variant="p2semi">
            {formatAsShorthandNumbers(tvl, {
              precision: 2,
            })}
          </Text>
        </div>
      </div>
    </GradientBox>
  )

  if (!url) {
    return insides
  }

  return <Link href={url}>{insides}</Link>
}

export const ProtocolScroller = ({
  protocolTvls,
  animationPixelPerSecond = 20,
}: ProtocolScrollerProps) => {
  const { screenSize } = useScreenSize()
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const protocolsList = useMemo(() => {
    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]

      return {
        protocol: protocolConfig.displayName,
        protocolIcon: supportedDefillamaProtocolsConfig[protocol].icon,
        tvl: BigInt(protocolTvls?.[protocol] ?? 0),
        url: '',
      }
    })
  }, [protocolTvls])

  // 280 is the width of the item, 16 is the gap
  const singleProtocolListWidth = protocolsList.length * (280 + 16)

  const protocolsListToDisplay = useMemo(() => {
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

  const totalLiquidityBigInt = useMemo(
    () => protocolsList.reduce((acc, { tvl }) => acc + tvl, 0n),
    [protocolsList],
  )

  const totalLiquidityInfo = useMemo(
    () =>
      formatAsShorthandNumbers(totalLiquidityBigInt, {
        precision: 4,
      }),
    [totalLiquidityBigInt],
  )

  const totalLiquidityDisplay = useMemo(
    () =>
      formatAsShorthandNumbers(Math.floor(Number(totalLiquidityBigInt) / 1e9) * 1e9, {
        precision: 0,
      }),
    [totalLiquidityBigInt],
  )

  return (
    <div className={protocolScrollerStyles.protocolScrollerWrapper}>
      <Text variant="h3" as="h3" className={protocolScrollerStyles.protocolScrollerHeader}>
        <span className={protocolScrollerStyles.headerLine}>
          Automated access to <Emphasis variant="h3colorful">DeFi&apos;s best protocols</Emphasis>
        </span>
        <span className={protocolScrollerStyles.headerLine}>
          with over <span title={`$${totalLiquidityInfo}`}>${totalLiquidityDisplay}</span> of total
          liquidity
        </span>
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
  )
}
