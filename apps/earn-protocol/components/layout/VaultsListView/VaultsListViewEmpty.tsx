'use client'

import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import errorImage from '@/public/img/misc/error.png'

export const VaultsListViewEmpty = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '2rem',
        marginTop: '2rem',
        marginBottom: '2rem',
      }}
    >
      <Image src={errorImage} alt="No vaults available" width={200} height={200} />
      <Text variant="h2" as="div">
        No vaults available right now
      </Text>
      <Text variant="p1" as="div" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        We couldn&apos;t load any vaults at the moment.
        <br />
        This is usually temporary — please refresh the page in a few moments.
      </Text>
    </div>
  )
}
