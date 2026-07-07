'use client'
import { type FC } from 'react'
import { Expander, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'

import { getDetailsLinks } from './vault-details-links'
import { VaultOpenHeaderBlock } from './VaultOpenHeaderBlock'

import styles from './VaultOpenViewDetails.module.css'

const getDetailsExpanderLabels = () => [
  'Historical yield',
  'Vault exposure',
  'Rebalancing activity',
  'Portfolio Composition History',
  'Users activity',
  'Strategy fees',
]

// Shown in place of VaultOpenViewDetails while the details query unit streams in (only ever
// visible if the server prefetch failed to hydrate and the client refetches via the API route).
export const VaultOpenDetailsLoading: FC<{
  vault?: SDKVaultType | SDKVaultishType
  isDaoManaged?: boolean
}> = ({ vault, isDaoManaged }) => {
  return (
    <div className={styles.vaultOpenViewDetailsWrapper}>
      <VaultOpenHeaderBlock
        detailsLinks={getDetailsLinks()}
        vault={vault}
        isDaoManaged={isDaoManaged}
      />
      {getDetailsExpanderLabels().map((expanderLabel) => (
        <Expander
          key={expanderLabel}
          title={
            <Text as="p" variant="p1semi">
              {expanderLabel}
            </Text>
          }
          defaultExpanded
        >
          <SkeletonLine
            height={448}
            radius="var(--radius-roundish)"
            style={{ marginTop: 'var(--spacing-space-medium)' }}
          />
        </Expander>
      ))}
    </div>
  )
}
