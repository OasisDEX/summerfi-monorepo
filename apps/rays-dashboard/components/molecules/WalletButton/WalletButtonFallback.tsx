/* eslint-disable no-magic-numbers */
import { Button, LoadingSpinner } from '@summerfi/app-ui'

export const WalletButtonFallback = () => {
  return (
    <Button variant="secondarySmall" style={{ backgroundColor: 'var(--color-neutral-10)' }}>
      <div
        style={{
          marginRight: 'var(--space-xxl)',
          marginLeft: 'var(--space-xxl)',
        }}
      >
        <LoadingSpinner />
      </div>
    </Button>
  )
}
