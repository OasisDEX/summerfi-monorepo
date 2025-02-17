import { EXTERNAL_LINKS, Text } from '@summerfi/app-ui'
import { formatAddress } from '@summerfi/app-utils'
import Image from 'next/image'
import Link from 'next/link'

import { BoostCards } from '@/components/molecules/BoostCards/BoostCards'
import { PageViewHandler } from '@/components/organisms/PageViewHandler/PageViewHandler'
import { basePath } from '@/helpers/base-path'
import { fetchRays } from '@/server-handlers/rays'

interface ClaimedPageProps {
  searchParams: Promise<{
    userAddress: string
  }>
}

export default async function ClaimedPage({ searchParams }: ClaimedPageProps) {
  const { userAddress } = await searchParams

  const userRays = await fetchRays({ address: userAddress })

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
          <Image
            src={`${basePath}/gif/claimed-rays.gif`}
            width="259"
            height="200"
            alt="claimed-rays"
            unoptimized
          />
          <Text as="h2" variant="h2">
            Wallet {formatAddress(userAddress)} has claimed{' '}
            {userRays.rays.eligiblePoints.toFixed(0)} $RAYS
          </Text>
          <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
            You can now earn additional $RAYS by using Summer.fi and it&apos;s features.
          </Text>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
              Read more about how you can earn extra $RAYS here:
            </Text>
            <Text as="p" variant="p2semi" style={{ display: 'inline', marginLeft: '10px' }}>
              <Link href={EXTERNAL_LINKS.KB.READ_ABOUT_RAYS} target="_blank">
                Read about Rays →
              </Link>
            </Text>
          </div>
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
        Earn more $RAYS
      </Text>
      <BoostCards userAddress={userAddress} />
      <PageViewHandler userAddress={searchParams.userAddress} />
    </div>
  )
}
