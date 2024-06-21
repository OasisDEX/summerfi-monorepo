'use client'

import { ProxyLinkComponent, Text } from '@summerfi/app-ui'
import { IconEye } from '@tabler/icons-react'
import Link from 'next/link'

import { LeaderboardItem } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

export const LeaderboardRank = ({ cell }: { cell: LeaderboardItem }) => {
  return (
    <Text
      as="p"
      variant="p1semi"
      style={{ color: 'var(--color-neutral-80)' }}
      className={classNames.positionColumn}
    >
      {[1, 2, 3].includes(Number(cell.position)) ? <>{cell.position} 🏆</> : cell.position}
    </Text>
  )
}

export const LeaderboardUser = ({ cell }: { cell: LeaderboardItem }) => {
  return (
    <Text as="p" variant="p1semi" className={classNames.userColumn}>
      {cell.ens ?? cell.userAddress}
      <IconEye
        size={18}
        onClick={() => {
          if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)

            searchParams.set('userAddress', cell.userAddress)
            window.location.search = searchParams.toString()
          }
        }}
      />
    </Text>
  )
}

export const LeaderboardRays = ({ cell }: { cell: LeaderboardItem }) => {
  return (
    <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
      {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
        Number(cell.totalPoints),
      )}
    </Text>
  )
}

export const LeaderboardPortfolio = ({ cell }: { cell: LeaderboardItem }) => {
  return (
    <Text as="p" variant="p2semi">
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
