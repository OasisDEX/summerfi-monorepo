import { SkeletonLine } from '@summerfi/app-earn-ui'

const VaultDetailsLoadingState = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <SkeletonLine
        width="35%"
        height={25}
        radius="var(--radius-roundish)"
        style={{ marginBottom: 'var(--general-space-8)' }}
      />
      <SkeletonLine
        width="100%"
        height={50}
        radius="var(--radius-roundish)"
        style={{ marginBottom: 'var(--general-space-32)' }}
      />
      <SkeletonLine width="100%" height={1250} radius="var(--radius-roundish)" />
      <SkeletonLine
        width="100%"
        height={1000}
        radius="var(--radius-roundish)"
        id="advanced-yield-data"
      />
      <SkeletonLine width="100%" height={851} radius="var(--radius-roundish)" id="security" />
      <SkeletonLine width="100%" height={257} radius="var(--radius-roundish)" id="faq" />
    </div>
  )
}

export default VaultDetailsLoadingState
