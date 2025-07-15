import { type FC, type ReactNode } from 'react'
import { Text } from '@summerfi/app-earn-ui'

interface VaultDetailsYieldsHeaderProps {
  tokenSymbol: ReactNode
  risk: ReactNode
}

export const VaultDetailsYieldsHeader: FC<VaultDetailsYieldsHeaderProps> = ({
  tokenSymbol,
  risk,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Text
        as="h5"
        variant="h5"
        style={{
          marginBottom: 'var(--general-space-16)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-small)' }}>
          {tokenSymbol} {risk} Risk Historical Yields
        </span>
      </Text>
      <Text
        as="p"
        variant="p2"
        style={{
          marginBottom: 'var(--spacing-space-x-large)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
    </div>
  )
}
