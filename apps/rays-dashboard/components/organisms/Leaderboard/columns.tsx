import { Button, EXTERNAL_LINKS, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import { IconEye } from '@tabler/icons-react'
import Link from 'next/link'

import { LeaderboardItem, LeaderboardResponse } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

const bannerLabels = ['Enable Automations', 'Open a position', 'Use Swap']

export const leaderboardColumns = {
  rank: {
    title: 'Rank',
    cellMapper: (cell: LeaderboardItem) => (
      <Text
        as="p"
        variant="p1semi"
        style={{ color: 'var(--color-neutral-80)' }}
        className={classNames.positionColumn}
      >
        {[1, 2, 3].includes(Number(cell.position)) ? <>{cell.position} 🏆</> : cell.position}
      </Text>
    ),
  },
  user: {
    title: 'User',
    cellMapper: (cell: LeaderboardItem) => (
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
    ),
  },
  rays: {
    title: 'Rays',
    cellMapper: (cell: LeaderboardItem) => (
      <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
        {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
          Number(cell.totalPoints),
        )}
      </Text>
    ),
  },
  portfolio: {
    title: 'Summer portfolio',
    cellMapper: (cell: LeaderboardItem) => (
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
    ),
  },
}

export const mapLeaderboardColumns = ({
  leaderboardData,
  connectedWalletAddress,
}: {
  leaderboardData: LeaderboardResponse['leaderboard']
  connectedWalletAddress?: string
}) => {
  const index = 4
  const preparedRows = leaderboardData.map((item) => ({
    cells: [
      leaderboardColumns.rank.cellMapper(item),
      leaderboardColumns.user.cellMapper(item),
      leaderboardColumns.rays.cellMapper(item),
      leaderboardColumns.portfolio.cellMapper(item),
    ],
  }))

  const bannerLink = connectedWalletAddress
    ? `/portfolio/${connectedWalletAddress}`
    : EXTERNAL_LINKS.KB.READ_ABOUT_RAYS

  const value = {
    cells: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '16px',
          background: 'linear-gradient(92deg, #fff3ef 0.78%, #f2fcff 99.57%)',
          padding: '16px',
          borderRadius: '16px',
        }}
      >
        <Text as="h5" variant="h5">
          How do I move up the leaderboard?
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: '24px',
          }}
        >
          {bannerLabels.map((label) => (
            <Link key={label} passHref legacyBehavior prefetch={false} href={bannerLink}>
              <ProxyLinkComponent style={{ color: 'var(--color-neutral-80)' }} target="_blank">
                <Button variant="neutralSmall">{label}</Button>
              </ProxyLinkComponent>
            </Link>
          ))}
        </div>
      </div>
    ),
  }
  const newArr = [
    ...preparedRows.slice(0, index),
    value,
    ...preparedRows.slice(index, preparedRows.length),
  ]

  const userIndex = leaderboardData
    .map((item) => item.userAddress)
    .findIndex((item) => item.toLowerCase() === connectedWalletAddress?.toLowerCase())

  if (userIndex !== -1) {
    const youAreHereValue = {
      cells: (
        <div style={{ paddingLeft: '12px' }}>
          <Text as="p" variant="p3semi">
            You&apos;re here 👇
          </Text>
        </div>
      ),
    }

    const finalUserIndex = userIndex >= index ? userIndex + 1 : userIndex

    return [
      ...newArr.slice(0, finalUserIndex),
      youAreHereValue,
      ...newArr.slice(finalUserIndex, newArr.length),
    ]
  }

  return newArr
}
