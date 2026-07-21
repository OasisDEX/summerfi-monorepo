'use client'

import { Text } from '@summerfi/app-earn-ui'

export const FooterWrapper = () => {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--general-space-8)',
        padding: '24px 16px',
      }}
    >
      <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        Summer.fi 2026
      </Text>
    </footer>
  )
}
