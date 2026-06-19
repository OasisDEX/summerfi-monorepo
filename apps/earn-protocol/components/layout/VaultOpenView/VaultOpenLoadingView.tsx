'use client'
import {
  Expander,
  Sidebar,
  SkeletonLine,
  Text,
  useMobileCheck,
  VaultOpenLoadingGrid,
} from '@summerfi/app-earn-ui'

import { RwaSidebarInfo } from '@/components/layout/RwaVault/RwaSidebarInfo'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import { detailsLinks } from './vault-details-links'

import vaultOpenViewStyles from './VaultOpenView.module.css'

export const VaultOpenLoadingView = ({
  isRwaVault = false,
  vaultCurator,
}: {
  isRwaVault?: boolean
  // RWA curator name, resolved cheaply at the page level (getVaultCuratedBy). When present the
  // curator expander shows the real title; otherwise it falls back to a skeleton title.
  vaultCurator?: string
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  return (
    <VaultOpenLoadingGrid
      isMobile={isMobile}
      isRwaVault={isRwaVault}
      // RwaSidebarInfo is fully static (no data), so render it as-is alongside the deposit sidebar
      // skeleton to keep the right column from shifting once the loaded view appears.
      rightExtraContent={isRwaVault ? <RwaSidebarInfo /> : undefined}
      detailsContent={
        <div className={vaultOpenViewStyles.leftContentWrapper}>
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} isRwaVault={isRwaVault} />
          {isRwaVault ? (
            <Expander
              title={
                vaultCurator ? (
                  <Text as="p" variant="p1semi">
                    {vaultCurator}
                  </Text>
                ) : (
                  <SkeletonLine width={160} height={20} radius="var(--radius-roundish)" />
                )
              }
              defaultExpanded
            >
              <SkeletonLine
                width="80%"
                height={16}
                radius="var(--radius-roundish)"
                style={{ margin: 'var(--spacing-space-medium) 10px 0' }}
              />
            </Expander>
          ) : null}
          {[
            isRwaVault ? 'Historical NAV price' : 'Historical yield',
            'Vault exposure',
            'Rebalancing activity',
            'Portfolio Composition History',
            'Users activity',
            'Strategy fees',
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
