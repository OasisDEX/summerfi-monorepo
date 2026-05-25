'use client'

import { type FC } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

import { CurationActivityTable } from '@/features/curation-activity/components/CurationActivityTable/CurationActivityTable'
import { type VaultCurationEvent } from '@/features/curation-activity/types'

interface CurationActivityProps {
  vault: SDKVaultType | SDKVaultishType
  curationEvents: VaultCurationEvent[]
}

export const CurationActivity: FC<CurationActivityProps> = ({ vault, curationEvents }) => {
  return (
    <Card style={{ marginTop: 'var(--spacing-space-medium)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Text as="p" variant="p2semi" style={{ marginBottom: 'var(--spacing-space-large)' }}>
          Previous 30 days
        </Text>
        <CurationActivityTable vault={vault} curationEvents={curationEvents} skeletonLines={4} />
      </div>
    </Card>
  )
}
