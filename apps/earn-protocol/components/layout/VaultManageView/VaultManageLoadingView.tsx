'use client'
import {
  Expander,
  Sidebar,
  SkeletonLine,
  Text,
  useMobileCheck,
  VaultManageLoadingGrid,
  WithArrow,
} from '@summerfi/app-earn-ui'

import { detailsLinks } from '@/components/layout/VaultOpenView/vault-details-links'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'

import vaultManageViewStyles from './VaultManageView.module.css'

export const VaultManageLoadingView = ({ isRwaVault = false }: { isRwaVault?: boolean }) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  // Mirror the loaded VaultManageViewDetails "About the strategy" expander list (collapsed,
  // lazy-loaded). RWA prepends the "Deposits and Withdrawals" history expander. Note: the manage
  // view keeps the label "Historical yield" even for RWA (only the open view relabels it to NAV).
  const aboutExpanderLabels = isRwaVault
    ? [
        'Deposits and Withdrawals',
        'Historical yield',
        'Vault exposure',
        'Strategy management fee',
        'Rebalancing activity',
        'Curation activity',
        'User activity',
      ]
    : [
        'Historical yield',
        'Vault exposure',
        'Strategy management fee',
        'Rebalancing activity',
        'Curation activity',
        'User activity',
      ]

  return (
    <VaultManageLoadingGrid
      isMobile={isMobile}
      isRwaVault={isRwaVault}
      detailsContent={[
        // "Forecasted Market Value" is expanded by default in the loaded (settled) view. Pre-claim
        // RWA hides it, but pending-vs-settled isn't knowable at load time — keep the common case.
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
          {/* Same intro the loaded view inlines. Detail links are non-navigating here — there is no
              vault to build a URL from while loading. */}
          <div>
            <Text as="p" variant="p1semi" style={{ marginBottom: 'var(--spacing-space-medium)' }}>
              About the strategy
            </Text>
            <Text as="p" variant="p2" style={{ color: 'var(--color-text-secondary)' }}>
              The Lazy Summer Protocol is a permissionless passive lending product, which sets out
              to offer effortless and secure optimised yield, while diversifying risk.
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                gap: 'var(--general-space-24)',
                marginTop: 'var(--general-space-20)',
              }}
            >
              {detailsLinks.map(({ label }) => (
                <Text
                  key={label}
                  as="p"
                  variant="p3semi"
                  style={{
                    color: 'var(--color-text-link)',
                    textDecoration: 'none',
                    paddingRight: 'var(--spacing-space-medium)',
                  }}
                >
                  <WithArrow>{label}</WithArrow>
                </Text>
              ))}
            </div>
          </div>
          {aboutExpanderLabels.map((expanderLabel) => (
            <Expander
              key={expanderLabel}
              title={
                <Text as="p" variant="p1semi">
                  {expanderLabel}
                </Text>
              }
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
          titleTabs={isRwaVault ? ['Deposit', 'Withdraw'] : ['Deposit', 'Withdraw', 'Switch']}
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
