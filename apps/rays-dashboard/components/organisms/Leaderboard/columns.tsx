import { Button, EXTERNAL_LINKS, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import Link from 'next/link'

import {
  LeaderboardPortfolio,
  LeaderboardRank,
  LeaderboardRays,
  LeaderboardUser,
} from '@/components/organisms/Leaderboard/components/LeaderboardColumns'
import { LeaderboardItem, LeaderboardResponse } from '@/types/leaderboard'

const bannerLabels = ['Enable Automations', 'Open a position', 'Use Swap']

export const leaderboardColumns = {
  rank: {
    title: 'Rank',
    cellMapper: (cell: LeaderboardItem) => <LeaderboardRank cell={cell} />,
  },
  user: {
    title: 'User',
    cellMapper: (cell: LeaderboardItem) => <LeaderboardUser cell={cell} />,
  },
  rays: {
    title: 'Rays',
    cellMapper: (cell: LeaderboardItem) => <LeaderboardRays cell={cell} />,
  },
  portfolio: {
    title: 'Summer portfolio',
    cellMapper: (cell: LeaderboardItem) => <LeaderboardPortfolio cell={cell} />,
  },
}

const filterSeparator = (item: LeaderboardItem | 'separator'): item is LeaderboardItem => {
  return item !== 'separator'
}

export const mapLeaderboardColumns = ({
  leaderboardData,
  userWalletAddress,
  skipBanner,
}: {
  leaderboardData: (LeaderboardItem | 'separator')[]
  userWalletAddress?: string
  skipBanner?: boolean
}) => {
  const hasSeparator = leaderboardData.includes('separator')
  const index = 4
  const preparedRows = leaderboardData.map((item) =>
    item === 'separator'
      ? {
          cells: Array.from({ length: Object.keys(leaderboardColumns).length })
            .fill('')
            .map((_, separatorIndex) => (
              <div
                key={`separator${userWalletAddress}_${separatorIndex}`}
                style={{
                  height: 0,
                  margin: '16px 0',
                  borderBottom: '3px dashed var(--color-neutral-20)',
                }}
              />
            )),
        }
      : {
          cells: [
            leaderboardColumns.rank.cellMapper(item),
            leaderboardColumns.user.cellMapper(item),
            leaderboardColumns.rays.cellMapper(item),
            leaderboardColumns.portfolio.cellMapper(item),
          ],
        },
  )

  const bannerLink = userWalletAddress
    ? `/portfolio/${userWalletAddress}`
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
  const newArr = skipBanner
    ? preparedRows
    : [...preparedRows.slice(0, index), value, ...preparedRows.slice(index, preparedRows.length)]

  const userIndex = leaderboardData
    .filter(filterSeparator)
    .map((item) => item.userAddress)
    .findIndex((item) => item.toLowerCase() === userWalletAddress?.toLowerCase())

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

    const addedUserIndex = [hasSeparator, !skipBanner].filter(Boolean).length

    const finalUserIndex = userIndex >= index ? userIndex + addedUserIndex : userIndex

    return [
      ...newArr.slice(0, finalUserIndex),
      youAreHereValue,
      ...newArr.slice(finalUserIndex, newArr.length),
    ]
  }

  return newArr
}
