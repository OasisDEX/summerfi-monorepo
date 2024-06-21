import { LeaderboardBanner } from '@/components/organisms/Leaderboard/components/LeaderboardBanner'
import {
  LeaderboardPortfolio,
  LeaderboardRank,
  LeaderboardRays,
  LeaderboardUser,
} from '@/components/organisms/Leaderboard/components/LeaderboardColumns'
import { LeaderboardItem } from '@/types/leaderboard'

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
  rays: {
    title: 'Rays',
    cellMapper: (cell: LeaderboardItem, userWalletAddress?: string) => (
      <LeaderboardRays cell={cell} userWalletAddress={userWalletAddress} />
    ),
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
  bannerEveryNth,
}: {
  leaderboardData: (LeaderboardItem | 'separator')[]
  userWalletAddress?: string
  skipBanner?: boolean
  bannerEveryNth?: number
}) => {
  const index = 4

  const parsedWalletAddress = userWalletAddress?.toLocaleLowerCase()

  const leaderboardBanner = {
    cells: <LeaderboardBanner key="leaderboardBanner" userWalletAddress={parsedWalletAddress} />,
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
            leaderboardColumns.rays.cellMapper(item, parsedWalletAddress),
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
