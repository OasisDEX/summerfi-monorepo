import {
  Expander,
  Sidebar,
  SkeletonLine,
  Text,
  VaultManageLoadingGrid,
} from '@summerfi/app-earn-ui'

import { detailsLinks } from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'

import vaultManageViewStyles from './VaultManageView.module.scss'

export const VaultManageLoadingView = () => {
  return (
    <VaultManageLoadingGrid
      detailsContent={[
        <div className={vaultManageViewStyles.leftContentWrapper} key="PerformanceBlock">
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Forecasted Market Value
              </Text>
            }
            defaultExpanded
          >
            <SkeletonLine
              height={448}
              radius="var(--radius-roundish)"
              style={{ marginTop: 'var(--spacing-space-medium)' }}
            />
          </Expander>
        </div>,
        <div className={vaultManageViewStyles.leftContentWrapper} key="AboutTheStrategy">
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} />
          {[
            'Historical yield',
            'Vault exposure',
            'Strategy management fee',
            'Rebalancing activity',
            'User activity',
          ].map((expanderLabel) => (
            <Expander
              key={expanderLabel}
              title={
                <Text as="p" variant="p1semi">
                  {expanderLabel}
                </Text>
              }
              defaultExpanded
            >
              <SkeletonLine
                height={448}
                radius="var(--radius-roundish)"
                style={{ marginTop: 'var(--spacing-space-medium)' }}
              />
            </Expander>
          ))}
        </div>,
      ]}
      sidebarContent={
        <Sidebar
          title="Deposit"
          content={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                margin: '32px 0 32px',
              }}
            >
              <SkeletonLine width="100%" height={25} radius="var(--radius-roundish)" />
              <SkeletonLine width="100%" height={40} radius="var(--radius-roundish)" />
            </div>
          }
          primaryButton={{
            label: '',
            loading: true,
          }}
          footnote={<SkeletonLine width="30%" height={15} radius="var(--radius-roundish)" />}
        />
      }
    />
  )
}
