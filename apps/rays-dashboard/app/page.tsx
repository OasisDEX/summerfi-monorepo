import { Button } from '@summerfi/app-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
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
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { fetchRays, type FetchRaysReturnType } from '@/server-handlers/rays'
import { configFetcher } from '@/server-handlers/system-config/calls/config'

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    userAddress: string
  }>
}) {
  const searchParamsAwaited = await searchParams
  const [config, userRays] = await Promise.all([
    configFetcher(),
    fetchRays({ address: searchParamsAwaited.userAddress }).then(
      parseServerResponseToClient,
    ) as Promise<FetchRaysReturnType>,
  ])

  const userLeaderboardStartingPage = String(
    userRays.rays?.positionInLeaderboard
      ? Math.ceil(
          Number(userRays.rays.positionInLeaderboard) / Number(userLeaderboardDefaults.limit),
        )
      : 1,
  )

  const userLeaderboardResponse = parseServerResponseToClient(
    await fetchLeaderboard({
      ...userLeaderboardDefaults,
      page: userLeaderboardStartingPage,
    }),
  )

  const topLeaderboardResponse =
    userLeaderboardStartingPage !== '1' &&
    parseServerResponseToClient(await fetchLeaderboard(leaderboardDefaults))

  const userYearlyRays = userLeaderboardResponse.leaderboard.find(
    (user) => user.position === userRays.rays?.positionInLeaderboard,
  )

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: topLeaderboardResponse
      ? [...topLeaderboardResponse.leaderboard, 'separator', ...userLeaderboardResponse.leaderboard]
      : userLeaderboardResponse.leaderboard,
    userWalletAddress: searchParamsAwaited.userAddress
      ? searchParamsAwaited.userAddress.toLocaleLowerCase()
      : undefined,
    skipBanner: true,
    page: '/',
    userRays,
  })

  const topClimbers = await fetchLeaderboard({
    limit: climbersCount.toString(),
    page: '1',
    sortMethod: 'top_gainers',
  })

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <ClaimRays
        userAddress={searchParamsAwaited.userAddress}
        userRays={userRays}
        pointsEarnedPerYear={userYearlyRays?.details?.pointsEarnedPerYear}
        announcement={config.parameters?.announcement}
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
                userAddress: searchParamsAwaited.userAddress,
              },
            }}
          >
            <Button variant="neutralSmall">View Full Leaderboard</Button>
          </Link>
        </div>
        <TopClimbersWrapper topClimbers={topClimbers} />
        <div style={{ marginTop: 'var(--space-xxl)' }}>
          <LeaderboardBanner userWalletAddress={searchParamsAwaited.userAddress} page="/" />
        </div>
      </div>
      {/**
       * The HomepageHandler component handles the redirection after wallet is connected.
       * Now mixpanel tracking as well
       */}
      <HomepageHandler userAddress={searchParamsAwaited.userAddress} />
      <PageViewHandler userAddress={searchParamsAwaited.userAddress} />
    </div>
  )
}
