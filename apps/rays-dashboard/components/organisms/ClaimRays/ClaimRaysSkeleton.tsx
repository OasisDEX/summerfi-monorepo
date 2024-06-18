import { Button, SkeletonLine } from '@summerfi/app-ui'

export const ClaimRaysSkeleton = () => {
  return (
    <>
      <div style={{ marginBottom: 'var(--space-xxs)' }}>
        <SkeletonLine width={400} height={64} />
      </div>
      <div style={{ marginBottom: 'var(--space-l)' }}>
        <SkeletonLine width={600} height={32} />
      </div>
      <div style={{ marginBottom: 'var(--space-l)' }}>
        <SkeletonLine width={350} height={350} />
      </div>
      <Button
        disabled
        variant="primaryLarge"
        style={{ marginTop: 'var(--space-l)', marginBottom: 'var(--space-s)' }}
      >
        Claim $RAYS
      </Button>
    </>
  )
}
