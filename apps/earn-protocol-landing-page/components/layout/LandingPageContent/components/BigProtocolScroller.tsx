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
import {
  type IconNamesList,
  type LandingPageData,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
} from '@summerfi/app-types'
import { formatAsShorthandNumbers, formatPercent } from '@summerfi/app-utils'
import Link from 'next/link'

import { useScreenSize } from '@/hooks/use-screen-size'

import bigProtocolScrollerStyles from '@/components/layout/LandingPageContent/components/BigProtocolScroller.module.css'

type BigProtocolScrollerTrackProps = {
  children: ReactNode
  ref: RefObject<HTMLDivElement | null>
  style: CSSProperties
}
type BigProtocolScrollerItemProps = {
  protocol: string
  protocolIcon: ReactNode
  tvl: bigint
  url: string
  strategy: string
  apy: [number, number]
  asset: string[]
}

type BigProtocolScrollerProps = {
  protocolTvls?: LandingPageData['protocolTvls']
  protocolApys?: LandingPageData['protocolApys']
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
  protocolIcon,
  protocol,
  tvl,
  url,
  strategy,
  asset,
  apy,
}: BigProtocolScrollerItemProps) => {
  const insides = (
    <Card className={bigProtocolScrollerStyles.bigProtocolScrollerItem}>
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemNameIcon}>
        <Icon iconName={protocolIcon as IconNamesList} size={44} />
        <Text variant="p1semi">{protocol}</Text>
      </div>
      <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataGrid}>
        <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataBlock}>
          <Text variant="p4semi" as="p">
            TVL
          </Text>
          <Text variant="p2semi" as="span">
            {formatAsShorthandNumbers(tvl, {
              precision: 2,
            })}
          </Text>
        </div>
        <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataBlock}>
          <Text variant="p4semi" as="p">
            Strategy
          </Text>
          <Text variant="p2semi" as="span">
            {strategy}
          </Text>
        </div>
        <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataBlock}>
          <Text variant="p4semi" as="p">
            Asset
          </Text>
          <Text variant="p2semi" as="span">
            {asset.join(', ')}
          </Text>
        </div>
        <div className={bigProtocolScrollerStyles.bigProtocolScrollerItemDataBlock}>
          <Text variant="p4semi" as="p">
            30d APY Range 24/25
          </Text>
          <Text variant="p2semi" as="span">
            {apy.map((apyValue) => formatPercent(apyValue, { precision: 2 })).join(' - ')}
          </Text>
        </div>
      </div>
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
  protocolTvls,
  protocolApys,
  animationPixelPerSecond = 30,
}: BigProtocolScrollerProps) => {
  const { screenSize } = useScreenSize()
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const protocolsList = useMemo(() => {
    return supportedDefillamaProtocols.map((protocol) => {
      const protocolConfig = supportedDefillamaProtocolsConfig[protocol]

      return {
        protocol: protocolConfig.displayName,
        protocolIcon: protocolConfig.icon,
        strategy: protocolConfig.strategy,
        asset: protocolConfig.asset,
        tvl: BigInt(protocolTvls?.[protocol] ?? 0),
        apy: protocolApys?.[protocol] ?? [0, 0],
        url: '',
      }
    })
  }, [protocolTvls, protocolApys])

  // 570 is the width of the item, 16 is the gap
  const singleProtocolListWidth = protocolsList.length * (570 + 16)

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

  return (
    <div className={bigProtocolScrollerStyles.bigProtocolScrollerWrapper}>
      <BigProtocolScrollerTrack
        ref={trackRef}
        style={{
          animationDuration: `${animationSpeedInSeconds}s`,
          animationPlayState: hovered ? 'paused' : 'running',
        }}
      >
        {protocolsListToDisplay.map(
          ({ protocol, protocolIcon, tvl, url, strategy, asset, apy }, index) => (
            <BigProtocolScrollerItem
              key={`${protocol}-${index}`}
              protocol={protocol}
              protocolIcon={protocolIcon}
              tvl={tvl}
              url={url}
              strategy={strategy}
              asset={asset}
              apy={apy}
            />
          ),
        )}
      </BigProtocolScrollerTrack>
    </div>
  )
}
