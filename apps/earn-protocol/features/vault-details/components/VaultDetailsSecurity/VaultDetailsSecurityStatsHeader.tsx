import { type FC } from 'react'
import { Text } from '@summerfi/app-earn-ui'

export const VaultDetailsSecurityStatsHeader: FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Text as="h5" variant="h5" style={{ marginBottom: 'var(--spacing-space-x-small)' }}>
        Security
      </Text>
      <Text
        as="p"
        variant="p2"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
    </div>
  )
}
