'use client'
import { Card, SkeletonLine } from '@summerfi/app-earn-ui'

// Shown in place of the Yields + Security sections while the content query unit streams in (only
// ever visible if the server prefetch failed to hydrate and the client refetches via the API
// route). HowItWorks + FAQ render immediately from the hydrated core, so they're not skeletoned.
export const VaultDetailsContentLoading = () => (
  <>
    <Card variant="cardSecondary">
      <SkeletonLine
        width="100%"
        height={520}
        radius="var(--radius-roundish)"
        style={{ margin: 'var(--spacing-space-medium) 0' }}
      />
    </Card>
    <Card variant="cardSecondary">
      <SkeletonLine
        width="100%"
        height={240}
        radius="var(--radius-roundish)"
        style={{ margin: 'var(--spacing-space-medium) 0' }}
      />
    </Card>
  </>
)
