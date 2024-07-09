import { Button, SkeletonLine } from '@summerfi/app-ui'

export const WalletButtonFallback = () => {
  return (
    <Button
      variant="secondarySmall"
      style={{ backgroundColor: 'var(--color-neutral-10)', padding: '0 5px', height: '40px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <SkeletonLine height={32} width={32} circle />
        <div style={{ marginLeft: '20px' }}>
          <SkeletonLine height={15} width={160} />
        </div>
      </div>
    </Button>
  )
}
