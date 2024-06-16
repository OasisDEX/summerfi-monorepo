import { Button, Text } from '@summerfi/app-ui'

import { CriteriaList } from '@/components/molecules/CriteriaList/CriteriaList'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { fetchLeaderboard } from '@/server-handlers/leaderboard'
import { LeaderboardResponse } from '@/types/leaderboard'

export default async function HomePage() {
  const serverLeaderboardResponse = await fetchLeaderboard('?page=1&limit=5')

  const serializedServerLeaderboardResponse: LeaderboardResponse = JSON.parse(
    JSON.stringify(serverLeaderboardResponse),
  )

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <Text as="h1" variant="h1" style={{ marginTop: 'var(--space-xxl)' }}>
        Claim your $RAYS
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{ color: 'var(--color-neutral-80)', marginBottom: 'var(--space-l)' }}
      >
        Over 2 million DeFi users are eligible for Summer.fi Rays.
      </Text>
      <CriteriaList />
      <Button
        variant="primaryLarge"
        style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-xxxl)' }}
      >
        Connect wallet
      </Button>
      <Leaderboard staticLeaderboardData={serializedServerLeaderboardResponse} />
    </div>
  )
}
