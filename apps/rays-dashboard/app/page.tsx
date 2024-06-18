import dynamic from 'next/dynamic'

import { ClaimRaysSkeleton } from '@/components/organisms/ClaimRays/ClaimRaysSkeleton'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { fetchRays } from '@/server-handlers/rays'
import { LeaderboardResponse } from '@/types/leaderboard'

const ClaimRays = dynamic(() => import('@/components/organisms/ClaimRays/ClaimRays'), {
  ssr: false,
  loading: () => <ClaimRaysSkeleton />,
})

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    userAddress: string
  }
}) {
  const serverLeaderboardResponse = await fetchLeaderboard({
    page: '1',
    limit: '5',
  })

  const serializedServerLeaderboardResponse: LeaderboardResponse = JSON.parse(
    JSON.stringify(serverLeaderboardResponse),
  )

  const userRays = await fetchRays({ address: searchParams.userAddress })

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <ClaimRays userAddress={searchParams.userAddress} userRays={userRays} />
      <div style={{ marginBottom: 'var(--space-xxxl)', width: '100%' }}>
        <Leaderboard staticLeaderboardData={serializedServerLeaderboardResponse} />
      </div>
    </div>
  )
}
