import { Button } from '@summerfi/app-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import Link from 'next/link'

import { mapLeaderboardColumns } from '@/components/organisms/Leaderboard/columns'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { LeaderboardSearchBoxAndResults } from '@/components/organisms/Leaderboard/LeaderboardSearchBoxAndResults'
import { PageViewHandler } from '@/components/organisms/PageViewHandler/PageViewHandler'
import { wholeLeaderboardDefaults } from '@/constants/leaderboard'
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { fetchRays, type FetchRaysReturnType } from '@/server-handlers/rays'

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: {
    userAddress: string
    page?: string
    search?: string
  }
}) {
  const userRays = parseServerResponseToClient(
    await fetchRays({ address: searchParams.userAddress }),
  ) as FetchRaysReturnType

  const topLeaderboardResponse = parseServerResponseToClient(
    await fetchLeaderboard({
      ...wholeLeaderboardDefaults,
      page: searchParams.page ?? wholeLeaderboardDefaults.page,
    }),
  )

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: topLeaderboardResponse.leaderboard,
    userWalletAddress: searchParams.userAddress,
    bannerEveryNth: 40,
    page: '/leaderboard',
    userRays,
  })

  const previousPageAvailable = searchParams.page && Number(searchParams.page) !== 1
  const nextPageAvailable =
    topLeaderboardResponse.leaderboard.length === Number(wholeLeaderboardDefaults.limit)

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 'var(--space-xxxl)',
        marginTop: 'var(--space-xl)',
      }}
    >
      <LeaderboardSearchBoxAndResults />
      <Leaderboard leaderboardData={mappedLeaderBoard} />
      <div
        style={{
          display: 'flex',
          gap: '18px',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 'var(--space-xl)',
        }}
      >
        <Link
          style={{
            pointerEvents: previousPageAvailable ? 'auto' : 'none',
            opacity: previousPageAvailable ? 1 : 0.5,
          }}
          href={
            previousPageAvailable
              ? {
                  pathname: '/leaderboard',
                  query: {
                    ...searchParams,
                    page:
                      Number(searchParams.page) - 1 === 1
                        ? undefined
                        : String(Number(searchParams.page) - 1),
                  },
                }
              : ''
          }
        >
          <Button disabled={!previousPageAvailable} variant="secondarySmall">
            previous page
          </Button>
        </Link>
        <Link
          style={{
            pointerEvents: nextPageAvailable ? 'auto' : 'none',
            opacity: nextPageAvailable ? 1 : 0.5,
          }}
          href={
            nextPageAvailable
              ? {
                  pathname: '/leaderboard',
                  query: { ...searchParams, page: String(Number(searchParams.page ?? 1) + 1) },
                }
              : ''
          }
        >
          <Button disabled={!nextPageAvailable} variant="secondarySmall">
            next page
          </Button>
        </Link>
      </div>
      <PageViewHandler userAddress={searchParams.userAddress} />
    </div>
  )
}
