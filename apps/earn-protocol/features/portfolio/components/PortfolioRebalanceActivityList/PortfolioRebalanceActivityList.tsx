import { useState } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'
import { formatDecimalAsPercent, timeAgo } from '@summerfi/app-utils'
import Link from 'next/link'

import classNames from './PortfolioRebalanceActivityList.module.scss'

const dummyList: {
  token: TokenSymbolsList
  icon: IconNamesList
  title: string
  timestamp: number
  change: string
  link: string
}[] = [
  {
    token: 'DAI',
    icon: 'withdraw',
    title: 'Increased yield',
    timestamp: 1729521746326,
    change: '0.0031',
    link: '/',
  },
  {
    token: 'WBTC',
    icon: 'withdraw',
    title: 'Reduced Risk',
    timestamp: 1729521746325,
    change: '0.0031',
    link: '/',
  },
  {
    token: 'USDC',
    icon: 'withdraw',
    title: 'Reduced Risk',
    timestamp: 1729521746324,
    change: '0.0031',
    link: '/',
  },
  {
    token: 'USDT',
    icon: 'withdraw',
    title: 'Increased yield',
    timestamp: 1729521746323,
    change: '0.0031',
    link: '/',
  },
  {
    token: 'ETH',
    icon: 'withdraw',
    title: 'Increased yield',
    timestamp: 1729521746322,
    change: '0.0031',
    link: '/',
  },
  {
    token: 'ETH',
    icon: 'withdraw',
    title: 'Increased yield',
    timestamp: 1729521746321,
    change: '0.0031',
    link: '/',
  },
]

export const PortfolioRebalanceActivityList = () => {
  // timestamp should be unique, so can be used as id
  const [hoveredItemTimestamp, setHoveredItemTimestamp] = useState<number>()

  return (
    <div className={classNames.wrapper}>
      {dummyList.map((item) => (
        <Link
          href={item.link}
          key={item.title + item.token + item.change + item.timestamp}
          onMouseEnter={() => setHoveredItemTimestamp(item.timestamp)}
          onMouseLeave={() => setHoveredItemTimestamp(undefined)}
        >
          <div className={classNames.contentWrapper}>
            <div className={classNames.leftContentWrapper}>
              <div className={classNames.iconWrapper}>
                <Icon
                  iconName={item.icon}
                  variant="s"
                  color={
                    hoveredItemTimestamp === item.timestamp
                      ? 'rgba(210, 210, 210, 1)'
                      : 'rgba(119, 117, 118, 1)'
                  }
                />
              </div>
              <div className={classNames.leftContent}>
                <Text as="p" variant="p2semi">
                  {item.title}
                </Text>
                <div className={classNames.leftContentDescription}>
                  <Icon tokenName={item.token} variant="s" />
                  <Text
                    as="p"
                    variant="p3semi"
                    style={{ color: 'var(--earn-protocol-secondary-60)' }}
                  >
                    {formatDecimalAsPercent(item.change)}
                  </Text>
                </div>
              </div>
            </div>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              {timeAgo({ from: new Date(), to: new Date(item.timestamp) })}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  )
}
