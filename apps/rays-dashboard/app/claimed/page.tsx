import { formatAddress, Text } from '@summerfi/app-ui'
import Image from 'next/image'

import { BoostCards } from '@/components/molecules/BoostCards/BoostCards'
import { fetchRays } from '@/server-handlers/rays'

interface ClaimedPageProps {
  searchParams: {
    userAddress: string
  }
}

export default async function ClaimedPage({ searchParams }: ClaimedPageProps) {
  const { userAddress } = searchParams

  const userRays = await fetchRays({ address: searchParams.userAddress })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'var(--space-xxl)',
        marginBottom: 'var(--space-xxl)',
      }}
    >
      {userRays.rays?.eligiblePoints && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 'var(--space-m)',
            marginBottom: 'var(--space-xxxl)',
            alignItems: 'center',
          }}
        >
          <Image src="/rays/gif/claimed-rays.gif" width="259" height="179" alt="claimed-rays" />
          <Text as="h2" variant="h2">
            Wallet {formatAddress(userAddress)} has claimed{' '}
            {userRays.rays.eligiblePoints.toFixed(0)} $RAYS
          </Text>
          <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
            Something about points and Protocol Litepaper here. Remod user why they want points
          </Text>
        </div>
      )}
      <Text
        as="h4"
        variant="h4"
        style={{
          color: 'var(--color-neutral-80)',
          textAlign: 'center',
          marginBottom: 'var(--space-m)',
        }}
      >
        Add more RAYS
      </Text>
      <BoostCards userAddress={userAddress} />
    </div>
  )
}
