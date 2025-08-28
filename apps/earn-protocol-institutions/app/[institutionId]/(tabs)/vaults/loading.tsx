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
            <SkeletonLine height={20} width={100} style={{ margin: '20px 0 30px 0' }} />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'var(--color-border)',
                margin: 'var(--spacing-space-medium) 0 var(--spacing-space-x-large)',
              }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
            <SkeletonLine
              height={14}
              width={Math.round(Number(Math.random() * 80) + 100)}
              style={{ margin: '20px 0', opacity: 0.6 }}
            />
          </Card>
        </div>
      }
      header={
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SkeletonLine height={12} width={60} />
              <SkeletonLine height={18} width={120} />
            </div>
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
