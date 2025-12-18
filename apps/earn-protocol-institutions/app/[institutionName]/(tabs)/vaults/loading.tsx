import { Card, LoadingSpinner, SkeletonLine } from '@summerfi/app-earn-ui'

import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'

import institutionVaultLayoutStyles from './[network]/[vaultAddress]/InstitutionVaultLayout.module.css'

export default function InstitutionVaultsLoadingTab() {
  return (
    <DashboardContentLayout
      panel={
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
              {Array.from({ length: 7 }).map((_, index) => (
                <SkeletonLine
                  key={index}
                  height={14}
                  width={Math.round(Number(Math.random() * 80) + 100)}
                  style={{ margin: '0 0', opacity: 0.6 }}
                />
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
              {Array.from({ length: 2 }).map((_, index) => (
                <SkeletonLine
                  key={index}
                  height={14}
                  width={Math.round(Number(Math.random() * 80) + 100)}
                  style={{ margin: '0 0', opacity: 0.6 }}
                />
              ))}
            </div>
          </Card>
        </div>
      }
      header={
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-space-2x-small)',
              marginTop: 'var(--spacing-space-x-small)',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-space-medium)',
                }}
              >
                <SkeletonLine height={12} width={60} />
                <SkeletonLine height={18} width={120} />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <Card variant="cardSecondary">
        <LoadingSpinner size={40} style={{ margin: '40px auto' }} />
      </Card>
    </DashboardContentLayout>
  )
}
