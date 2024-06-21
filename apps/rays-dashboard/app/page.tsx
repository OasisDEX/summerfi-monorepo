import ClaimRays from '@/components/organisms/ClaimRays/ClaimRays'
import { mapLeaderboardColumns } from '@/components/organisms/Leaderboard/columns'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { leaderboardDefaults, userLeaderboardDefaults } from '@/constants/leaderboard'
import { parseServerResponse } from '@/helpers/parse-server-response'
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { fetchRays, RaysApiResponse } from '@/server-handlers/rays'
import { LeaderboardResponse } from '@/types/leaderboard'

export default async function HomePage({
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

  const userleaderboardStartingPage = String(
    userRays.rays?.positionInLeaderboard
      ? Math.ceil(
          Number(userRays.rays.positionInLeaderboard) / Number(userLeaderboardDefaults.limit),
        )
      : 1,
  )

  const userLeaderboardResponse = parseServerResponse<LeaderboardResponse>(
    await fetchLeaderboard({
      ...userLeaderboardDefaults,
      page: userleaderboardStartingPage,
    }),
  )

  const topLeaderboardResponse =
    userleaderboardStartingPage !== '1' &&
    parseServerResponse<LeaderboardResponse>(await fetchLeaderboard(leaderboardDefaults))

  const userYearlyRays = userLeaderboardResponse.leaderboard.find(
    (user) => user.position === userRays.rays?.positionInLeaderboard,
  )

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: topLeaderboardResponse
      ? [...topLeaderboardResponse.leaderboard, 'separator', ...userLeaderboardResponse.leaderboard]
      : userLeaderboardResponse.leaderboard,
    userWalletAddress: searchParams.userAddress,
    skipBanner: true,
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
        <Leaderboard leaderboardData={mappedLeaderBoard} />
      </div>
    </div>
  )
}
