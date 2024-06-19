import { SkeletonLine } from '@summerfi/app-ui'

export const ClaimRaysSkeleton = () => (
  <>
    <div style={{ marginBottom: 0 }}>
      <SkeletonLine width={450} height={64} />
    </div>
    <div style={{ marginBottom: 'var(--space-m)' }}>
      <SkeletonLine width={550} height={32} />
    </div>
    <div style={{ marginBottom: 'var(--space-l)' }}>
      <SkeletonLine width={350} height={320} />
    </div>
    <SkeletonLine width={350} height={70} />
  </>
)
