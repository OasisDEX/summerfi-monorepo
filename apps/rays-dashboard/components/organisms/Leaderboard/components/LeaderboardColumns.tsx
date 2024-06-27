'use client'

import { Button, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import { IconArrowDown, IconArrowUp, IconEye, IconTrophyFilled } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { trackButtonClick } from '@/helpers/mixpanel'
import { LeaderboardItem } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

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
    <>
      {userWalletAddress && userWalletAddress === cell.userAddress ? (
        <div style={{ paddingLeft: '12px', height: '30px' }}>
          <Text as="p" variant="p3semi">
            You&apos;re here 👇
          </Text>
        </div>
      ) : null}
      <div className={classNames.positionColumn}>
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
            fontSize: '14px',
            width: '100%',
            marginLeft: '14px',
          }}
          title="Leaderboard change over 24h"
        >
          {rankChange === 0 ? '' : rankChange}
          {rankChange > 0 && <IconArrowUp size={14} strokeWidth={3} />}
          {rankChange < 0 && <IconArrowDown size={14} strokeWidth={3} />}
        </Text>
      </div>
    </>
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
      className={classNames.userColumn}
      style={
        userWalletAddress && userWalletAddress === cell.userAddress ? { marginTop: '30px' } : {}
      }
    >
      {cell.ens ?? cell.userAddress}
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
  userWalletAddress,
}: {
  cell: LeaderboardItem
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
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
        Number(cell.totalPoints),
      )}
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
        <ProxyLinkComponent style={{ color: 'var(--color-neutral-80)' }} target="_blank">
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
            {cell.details
              ? `${cell.details.activePositions} positions, ${cell.details.activeTriggers} automations `
              : 'No positions '}
            -&gt;
          </Button>
        </ProxyLinkComponent>
      </Link>
    </Text>
  )
}
