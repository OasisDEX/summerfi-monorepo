'use client'
import { SkeletonLine } from '@summerfi/app-earn-ui'

import { VaultDetailsContentLoading } from '@/components/layout/VaultDetailsView/VaultDetailsContentLoading'

// Suspense fallback streamed while the server prefetch resolves. The VaultGridDetails shell needs
// a real vault to render, so the fallback is a lightweight stand-in: a header bar plus the same
// section skeletons used once the shell is hydrated.
export const VaultDetailsLoadingView = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-space-large)',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto',
      padding: 'var(--spacing-space-large) var(--spacing-space-medium)',
    }}
  >
    <SkeletonLine width="40%" height={48} radius="var(--radius-roundish)" />
    <SkeletonLine width="100%" height={120} radius="var(--radius-roundish)" />
    <VaultDetailsContentLoading />
  </div>
)
