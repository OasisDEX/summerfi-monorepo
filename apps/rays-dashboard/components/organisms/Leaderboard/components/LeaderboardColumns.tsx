'use client'

import { type LeaderboardItem } from '@summerfi/app-types'
import { Button, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import { formatAddress } from '@summerfi/app-utils'
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconEye,
  IconTrophyFilled,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { trackButtonClick } from '@/helpers/mixpanel'

import leaderboardStyles from '@/components/organisms/Leaderboard/Leaderboard.module.css'

const uprankColor = 'var(--color-success-70)'
const downrankColor = 'var(--color-critical-70)'

export const LeaderboardRank = ({
  cell,
  userWalletAddress,
}: {
  cell: LeaderboardItem
  userWalletAddress?: string
}) => {
  const position = Number(cell.position)
  const lastPosition = Number(cell.rank22h)
  const isTop = [1, 2, 3].includes(position)
  const rankChange = lastPosition - position
  const rankChangeColor = rankChange > 0 ? uprankColor : rankChange < 0 ? downrankColor : ''

  return (
    <div style={{ position: 'relative' }}>
      {userWalletAddress && userWalletAddress === cell.userAddress ? (
        <div className={leaderboardStyles.youreHere}>
          <Text as="p" variant="p3semi">
            You&apos;re&nbsp;here&nbsp;👇
          </Text>
        </div>
      ) : null}
      <div className={leaderboardStyles.positionColumn}>
        <Text as="p" style={{ color: 'var(--color-neutral-80)' }}>
          {cell.position}
        </Text>
        {isTop && (
          <IconTrophyFilled
            style={{ marginLeft: '4px' }}
            color={
              {
                1: 'gold',
                2: 'silver',
                3: 'brown',
              }[position as 1 | 2 | 3]
            }
          />
        )}
        <Text
          as="p"
          style={{
            color: rankChangeColor,
          }}
          className={leaderboardStyles.rankChange}
          title="Leaderboard change over 24h"
        >
          {rankChange === 0 ? '' : rankChange}&nbsp;
          {rankChange > 0 && <IconArrowUp size={14} strokeWidth={3} />}
          {rankChange < 0 && <IconArrowDown size={14} strokeWidth={3} />}
        </Text>
      </div>
    </div>
  )
}

export const LeaderboardUser = ({
  cell,
  userWalletAddress,
}: {
  cell: LeaderboardItem
  userWalletAddress?: string
}) => {
  const currentPath = usePathname()

  return (
    <Text
      as="p"
      variant={
        userWalletAddress && userWalletAddress === cell.userAddress ? 'p1semiColorful' : 'p1semi'
      }
      className={leaderboardStyles.userColumn}
      style={
        userWalletAddress && userWalletAddress === cell.userAddress ? { marginTop: '30px' } : {}
      }
    >
      {cell.ens ?? formatAddress(cell.userAddress, { first: 5, last: 5 })}
      <Link
        href={{
          pathname: '/',
          query: { userAddress: cell.userAddress },
        }}
      >
        <IconEye
          size={18}
          onClick={() => {
            trackButtonClick({
              id: 'LeaderboardPeek',
              page: currentPath,
              value: cell.userAddress,
              source: 'Leaderboard',
              ...(cell.details && {
                activePositions: cell.details.activePositions,
                activeTriggers: cell.details.activeTriggers,
              }),
            })
          }}
        />
      </Link>
    </Text>
  )
}

export const LeaderboardRays = ({
  cell,
  raysCount,
  userWalletAddress,
}: {
  cell: LeaderboardItem
  raysCount: number
  userWalletAddress?: string
}) => {
  return (
    <Text
      as="p"
      style={
        userWalletAddress && userWalletAddress === cell.userAddress
          ? { marginTop: '30px', color: 'var(--color-neutral-80)' }
          : { color: 'var(--color-neutral-80)' }
      }
    >
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(raysCount))}
    </Text>
  )
}

export const LeaderboardPortfolio = ({
  cell,
  userWalletAddress,
}: {
  cell: LeaderboardItem
  userWalletAddress?: string
}) => {
  const currentPath = usePathname()

  return (
    <Text
      as="p"
      style={
        userWalletAddress && userWalletAddress === cell.userAddress ? { marginTop: '30px' } : {}
      }
    >
      <Link passHref legacyBehavior prefetch={false} href={`/portfolio/${cell.userAddress}`}>
        <ProxyLinkComponent className={leaderboardStyles.portfolioLink} target="_blank">
          <Button
            variant="unstyled"
            onClick={() => {
              trackButtonClick({
                id: 'LeaderboardPortfolio',
                page: currentPath,
                value: cell.userAddress,
                ...(cell.details && {
                  activePositions: cell.details.activePositions,
                  activeTriggers: cell.details.activeTriggers,
                }),
              })
            }}
          >
            {cell.details ? `${cell.details.activePositions} positions` : 'No positions '}
            <IconArrowRight size={14} />
          </Button>
        </ProxyLinkComponent>
      </Link>
    </Text>
  )
}
