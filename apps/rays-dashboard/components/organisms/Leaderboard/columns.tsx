import { type LeaderboardItem } from '@summerfi/app-types'

import { LeaderboardBanner } from '@/components/organisms/Leaderboard/components/LeaderboardBanner'
import {
  LeaderboardPortfolio,
  LeaderboardRank,
  LeaderboardRays,
  LeaderboardUser,
} from '@/components/organisms/Leaderboard/components/LeaderboardColumns'
import { type FetchRaysReturnType } from '@/server-handlers/rays'

export const leaderboardColumns = {
  rank: {
    title: 'Rank',
    cellMapper: (cell: LeaderboardItem, userWalletAddress?: string) => (
      <LeaderboardRank cell={cell} userWalletAddress={userWalletAddress} />
    ),
  },
  user: {
    title: 'User',
    cellMapper: (cell: LeaderboardItem, userWalletAddress?: string) => (
      <LeaderboardUser cell={cell} userWalletAddress={userWalletAddress} />
    ),
  },
  raysS1: {
    title: 'Season 1 Rays',
    cellMapper: (cell: LeaderboardItem, userWalletAddress?: string) => (
      <LeaderboardRays
        raysCount={Number(cell.tgeSnapshotPoints)}
        cell={cell}
        userWalletAddress={userWalletAddress}
      />
    ),
  },
  raysS2: {
    title: 'Season 2 Rays',
    cellMapper: (
      cell: LeaderboardItem,
      userWalletAddress?: string,
      userRays?: FetchRaysReturnType,
    ) => {
      const isConnectedUser = userWalletAddress === cell.userAddress

      if (isConnectedUser) {
        // theres no daily users data for the leaderboard unfortunately
        // so we're showing the daily rays count from the user's data
        const dailyRaysCount = userRays?.rays?.dailyChallengeRays ?? 0

        return (
          <LeaderboardRays
            raysCount={Math.max(
              0,
              Number(cell.totalPoints) - Number(cell.tgeSnapshotPoints) + dailyRaysCount,
            )}
            cell={cell}
            userWalletAddress={userWalletAddress}
          />
        )
      }

      return (
        <LeaderboardRays
          raysCount={Math.max(0, Number(cell.totalPoints) - Number(cell.tgeSnapshotPoints))}
          cell={cell}
          userWalletAddress={userWalletAddress}
        />
      )
    },
  },
  totalRays: {
    title: 'Total Rays',
    cellMapper: (
      cell: LeaderboardItem,
      userWalletAddress?: string,
      userRays?: FetchRaysReturnType,
    ) => {
      const isConnectedUser = userWalletAddress === cell.userAddress

      if (isConnectedUser) {
        return (
          <LeaderboardRays
            raysCount={Math.max(0, userRays?.rays?.allPossiblePoints ?? Number(cell.totalPoints))}
            cell={cell}
            userWalletAddress={userWalletAddress}
          />
        )
      }

      return (
        <LeaderboardRays
          raysCount={Number(cell.totalPoints)}
          cell={cell}
          userWalletAddress={userWalletAddress}
        />
      )
    },
  },
  portfolio: {
    title: 'Summer portfolio',
    cellMapper: (cell: LeaderboardItem, userWalletAddress?: string) => (
      <LeaderboardPortfolio cell={cell} userWalletAddress={userWalletAddress} />
    ),
  },
}

export const mapLeaderboardColumns = ({
  leaderboardData,
  userWalletAddress,
  skipBanner,
  page,
  bannerEveryNth,
  userRays,
}: {
  leaderboardData: (LeaderboardItem | 'separator')[]
  userWalletAddress?: string
  page: string
  skipBanner?: boolean
  bannerEveryNth?: number
  userRays?: FetchRaysReturnType
}) => {
  const index = 4

  const parsedWalletAddress = userWalletAddress?.toLocaleLowerCase()

  const leaderboardBanner = {
    cells: (
      <LeaderboardBanner
        key="leaderboardBanner"
        userWalletAddress={parsedWalletAddress}
        page={page}
      />
    ),
  }

  let preparedRows = leaderboardData.map((item) =>
    item === 'separator'
      ? {
          cells: Array.from({ length: Object.keys(leaderboardColumns).length })
            .fill('')
            .map((_, separatorIndex) => (
              <div
                key={`separator${parsedWalletAddress}_${separatorIndex}`}
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
            leaderboardColumns.rank.cellMapper(item, parsedWalletAddress),
            leaderboardColumns.user.cellMapper(item, parsedWalletAddress),
            leaderboardColumns.raysS1.cellMapper(item, parsedWalletAddress),
            leaderboardColumns.raysS2.cellMapper(item, parsedWalletAddress, userRays),
            leaderboardColumns.totalRays.cellMapper(item, parsedWalletAddress, userRays),
            leaderboardColumns.portfolio.cellMapper(item, parsedWalletAddress),
          ],
        },
  )

  if (!skipBanner) {
    preparedRows =
      skipBanner ?? !!bannerEveryNth
        ? preparedRows
        : [
            ...preparedRows.slice(0, index),
            leaderboardBanner as unknown as (typeof preparedRows)[0],
            ...preparedRows.slice(index, preparedRows.length),
          ]
  }

  if (bannerEveryNth) {
    const newArrWithBanners = preparedRows.reduce<typeof preparedRows>((acc, item, idx) => {
      if (idx % bannerEveryNth === 0 && idx !== 0) {
        acc.push(leaderboardBanner as unknown as (typeof preparedRows)[0])
      }
      acc.push(item)

      return acc
    }, [])

    return newArrWithBanners
  }

  return preparedRows
}
