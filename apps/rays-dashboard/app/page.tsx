import ClaimRays from '@/components/organisms/ClaimRays/ClaimRays'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { leaderboardDefaults } from '@/constants/leaderboard'
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

  const startingPage = String(
    userRays.rays?.positionInLeaderboard
      ? Math.ceil(Number(userRays.rays.positionInLeaderboard) / Number(leaderboardDefaults.limit))
      : 1,
  )

  const serverLeaderboardResponse = parseServerResponse<LeaderboardResponse>(
    await fetchLeaderboard({
      ...leaderboardDefaults,
      page: startingPage,
    }),
  )

  const userYearlyRays = serverLeaderboardResponse.leaderboard.find(
    (user) => user.position === userRays.rays?.positionInLeaderboard,
  )

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
        <Leaderboard
          staticLeaderboardData={serverLeaderboardResponse}
          connectedWalletAddress={searchParams.userAddress}
          pagination={{
            ...leaderboardDefaults,
            page: startingPage,
          }}
        />
      </div>
    </div>
  )
}
