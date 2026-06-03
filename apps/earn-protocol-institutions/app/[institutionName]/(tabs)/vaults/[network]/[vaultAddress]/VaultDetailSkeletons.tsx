import { Card, SkeletonLine } from '@summerfi/app-earn-ui'

import institutionVaultLayoutStyles from './InstitutionVaultLayout.module.css'

const PANEL_NAV_KEYS = ['nav-1', 'nav-2', 'nav-3', 'nav-4', 'nav-5', 'nav-6', 'nav-7']
const PANEL_FOOTER_KEYS = ['foot-1', 'foot-2']
const HEADER_KEYS = ['name', 'apy', 'nav', 'aum', 'fee', 'inception']

// Suspense fallback for the streamed vault-detail panel (vault dropdown + navigation). Mirrors the
// markup in vaults/loading.tsx so first-load and in-layout streaming look identical.
export const VaultDetailPanelSkeleton = () => (
  <div className={institutionVaultLayoutStyles.dashboardVaultsPanelWrapper}>
    <Card
      variant="cardSecondary"
      style={{ padding: 'var(--spacing-space-medium) var(--spacing-space-large)' }}
    >
      <SkeletonLine height={20} style={{ margin: '5px 0' }} />
    </Card>
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-space-large)',
          marginBottom: 'var(--spacing-space-large)',
        }}
      >
        <SkeletonLine height={20} width={100} />
        {PANEL_NAV_KEYS.map((key) => (
          <SkeletonLine key={key} height={14} width={140} style={{ opacity: 0.6 }} />
        ))}
      </div>
      <div
        style={{
          height: '1px',
          width: '100%',
          backgroundColor: 'var(--color-border)',
          margin: 'var(--spacing-space-medium) 0 var(--spacing-space-x-large)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '46px',
          marginTop: 'var(--spacing-space-2x-small)',
          marginBottom: 'var(--spacing-space-small)',
        }}
      >
        {PANEL_FOOTER_KEYS.map((key) => (
          <SkeletonLine key={key} height={14} width={140} style={{ opacity: 0.6 }} />
        ))}
      </div>
    </Card>
  </div>
)

// Suspense fallback for the streamed vault-detail header (the six DataBlocks).
export const VaultDetailHeaderSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-space-2x-small)',
        marginTop: 'var(--spacing-space-x-small)',
      }}
    >
      {HEADER_KEYS.map((key) => (
        <div
          key={key}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          <SkeletonLine height={12} width={60} />
          <SkeletonLine height={18} width={120} />
        </div>
      ))}
    </div>
  </div>
)
