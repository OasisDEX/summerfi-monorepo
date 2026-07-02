'use client'

import { type FC } from 'react'
import { Card, DataBlock, SimpleGrid, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import Link from 'next/link'

import { CurationActivityTable } from '@/features/curation-activity/components/CurationActivityTable/CurationActivityTable'
import { type VaultCurationEvent } from '@/features/curation-activity/types'

interface CurationActivityProps {
  vault: SDKVaultType | SDKVaultishType
  curationEvents: VaultCurationEvent[]
}

export const CurationActivity: FC<CurationActivityProps> = ({ vault, curationEvents }) => {
  const markets = vault.arks.filter((ark) => !ark.name?.toLowerCase().includes('buffer'))
  // "supported" = every ark (mirrors the Vault-exposure "All" view); "allocated to" = arks currently
  // holding assets (mirrors the exposure "Allocated" filter: inputTokenBalance > 0).
  const marketsSupported = markets.length
  const marketsAllocatedTo = markets.filter((ark) => Number(ark.inputTokenBalance) > 0).length

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        gap: 'var(--spacing-space-medium)',
      }}
    >
      <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-x-small)' }}>
        Previous 30 days
      </Text>
      <SimpleGrid columns={3} gap="var(--general-space-16)">
        <DataBlock
          size="large"
          titleSize="small"
          title="Composition Changes"
          value={curationEvents.length}
        />
        <DataBlock
          size="large"
          titleSize="small"
          title="Markets supported"
          value={marketsSupported}
        />
        <DataBlock
          size="large"
          titleSize="small"
          title="Markets Allocated to"
          value={marketsAllocatedTo}
        />
      </SimpleGrid>
      <Text as="p" variant="p2" style={{ color: 'var(--color-text-secondary)' }}>
        Occasionally changes are made to the composition of the portfolio of the Vault, either with
        new markets being added and older ones being removed, or the target allocations being
        adjusted to better meet the current outlook and opportunity to best balance risk and reward.
        For any upcoming changes to the portfolio, please keep an eye on the announcements{' '}
        <Link href="#" style={{ color: 'var(--color-text-link)' }}>
          here
        </Link>
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CurationActivityTable vault={vault} curationEvents={curationEvents} skeletonLines={4} />
      </div>
    </Card>
  )
}
