import { Button } from '@summerfi/app-ui'
import Link from 'next/link'

import { TopClimbersWrapper } from '@/components/molecules/TopClimbers/TopClimbersWrapper'
import ClaimRays from '@/components/organisms/ClaimRays/ClaimRays'
import { HomepageHandler } from '@/components/organisms/HomepageHandler/HomepageHandler'
import { mapLeaderboardColumns } from '@/components/organisms/Leaderboard/columns'
import { LeaderboardBanner } from '@/components/organisms/Leaderboard/components/LeaderboardBanner'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { LeaderboardSearchBoxAndResults } from '@/components/organisms/Leaderboard/LeaderboardSearchBoxAndResults'
import { PageViewHandler } from '@/components/organisms/PageViewHandler/PageViewHandler'
import {
  climbersCount,
  leaderboardDefaults,
  userLeaderboardDefaults,
} from '@/constants/leaderboard'
import { parseServerResponse } from '@/helpers/parse-server-response'
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { fetchRays, RaysApiResponse } from '@/server-handlers/rays'
import { LeaderboardResponse } from '@/types/leaderboard'

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: {
    userAddress: string
  }
}) {
  const userRays = parseServerResponse<
    | {
        rays: RaysApiResponse
        error?: undefined
      }
    | {
        error: unknown
        rays?: undefined
      }
  >(await fetchRays({ address: searchParams.userAddress }))

  const userLeaderboardStartingPage = String(
    userRays.rays?.positionInLeaderboard
      ? Math.ceil(
          Number(userRays.rays.positionInLeaderboard) / Number(userLeaderboardDefaults.limit),
        )
      : 1,
  )

  const userLeaderboardResponse = parseServerResponse<LeaderboardResponse>(
    await fetchLeaderboard({
      ...userLeaderboardDefaults,
      page: userLeaderboardStartingPage,
    }),
  )

  const topLeaderboardResponse =
    userLeaderboardStartingPage !== '1' &&
    parseServerResponse<LeaderboardResponse>(await fetchLeaderboard(leaderboardDefaults))

  const userYearlyRays = userLeaderboardResponse.leaderboard.find(
    (user) => user.position === userRays.rays?.positionInLeaderboard,
  )

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: topLeaderboardResponse
      ? [...topLeaderboardResponse.leaderboard, 'separator', ...userLeaderboardResponse.leaderboard]
      : userLeaderboardResponse.leaderboard,
    userWalletAddress: searchParams.userAddress
      ? searchParams.userAddress.toLocaleLowerCase()
      : undefined,
    skipBanner: true,
    page: '/',
  })

  const topClimbers = await fetchLeaderboard({
    page: '1',
    limit: climbersCount.toString(),
    sortMethod: 'top_gainers',
  })

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <ClaimRays
        userAddress={searchParams.userAddress}
        userRays={userRays}
        pointsEarnedPerYear={userYearlyRays?.details?.pointsEarnedPerYear}
      />
      <div
        style={{ marginBottom: 'var(--space-xxxl)', marginTop: 'var(--space-xxxl)', width: '100%' }}
      >
        <LeaderboardSearchBoxAndResults />
        <Leaderboard leaderboardData={mappedLeaderBoard} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 'var(--space-xl)',
          }}
        >
          <Link
            href={{
              pathname: '/leaderboard',
              query: {
                userAddress: searchParams.userAddress,
              },
            }}
          >
            <Button variant="neutralSmall">View Full Leaderboard</Button>
          </Link>
        </div>
        <div style={{ marginTop: 'var(--space-xxl)' }}>
          <LeaderboardBanner userWalletAddress={searchParams.userAddress} page="/" />
        </div>
      </div>
      <TopClimbersWrapper topClimbers={topClimbers} />
      {/**
       * The HomepageHandler component handles the redirection after wallet is connected.
       * Now mixpanel tracking as well
       */}
      <HomepageHandler userAddress={searchParams.userAddress} />
      <PageViewHandler userAddress={searchParams.userAddress} />
    </div>
  )
}
