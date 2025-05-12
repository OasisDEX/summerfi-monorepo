import { Expander, Sidebar, SkeletonLine, Text, VaultOpenLoadingGrid } from '@summerfi/app-earn-ui'

import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'

import { detailsLinks } from './vault-details-links'

import vaultOpenViewStyles from './VaultOpenView.module.css'

export const VaultOpenLoadingView = () => {
  return (
    <VaultOpenLoadingGrid
      detailsContent={
        <div className={vaultOpenViewStyles.leftContentWrapper}>
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} />
          {[
            'Historical yield',
            'Vault exposure',
            'Rebalancing activity',
            'Users activity',
            'Strategy management fee',
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
        </div>
      }
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
              <SkeletonLine
                width="100%"
                height={76}
                radius="var(--radius-roundish)"
                style={{ marginTop: '10px' }}
              />
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
