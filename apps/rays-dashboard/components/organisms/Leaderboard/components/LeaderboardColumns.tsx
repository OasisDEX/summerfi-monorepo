'use client'

import { ProxyLinkComponent, Text } from '@summerfi/app-ui'
import { IconEye } from '@tabler/icons-react'
import Link from 'next/link'

import { LeaderboardItem } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

export const LeaderboardRank = ({
  cell,
  userWalletAddress,
}: {
  cell: LeaderboardItem
  userWalletAddress?: string
}) => {
  return (
    <>
      {userWalletAddress && userWalletAddress === cell.userAddress ? (
        <div style={{ paddingLeft: '12px', height: '30px' }}>
          <Text as="p" variant="p3semi">
            You&apos;re here 👇
          </Text>
        </div>
      ) : (
        ''
      )}
      <Text
        as="p"
        style={{ color: 'var(--color-neutral-80)' }}
        className={classNames.positionColumn}
      >
        {[1, 2, 3].includes(Number(cell.position)) ? <>{cell.position} 🏆</> : cell.position}
      </Text>
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
        <IconEye size={18} />
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
  return (
    <Text
      as="p"
      style={
        userWalletAddress && userWalletAddress === cell.userAddress ? { marginTop: '30px' } : {}
      }
    >
      <Link passHref legacyBehavior prefetch={false} href={`/portfolio/${cell.userAddress}`}>
        <ProxyLinkComponent style={{ color: 'var(--color-neutral-80)' }} target="_blank">
          {cell.details
            ? `${cell.details.activePositions} positions, ${cell.details.activeTriggers} automations `
            : 'No positions '}
          -&gt;
        </ProxyLinkComponent>
      </Link>
    </Text>
  )
}
