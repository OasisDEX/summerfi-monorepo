import { Card, SkeletonLine } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'

import { getCachedInstitutionVaults } from '@/app/server-handlers/institution/institution-vaults'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'
import { TopBlocks } from '@/components/layout/TopBlocks/TopBlocks'
import { getVaultPerformance } from '@/helpers/get-vault-performance'

import topBlocksStyles from '@/components/layout/TopBlocks/TopBlocks.module.css'

const tabBarStyle = {
  paddingTop: 'var(--spacing-space-medium)',
  position: 'sticky' as const,
  top: 0,
  zIndex: 10000, // has to be above chart tooltips, otherwise it looks weird
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(28,28,28, 0.5)',
}

const TOP_BLOCK_KEYS = ['total-value', 'vault-count', 'apy-30d', 'all-time']

// The stats strip + tab bar both need the (cached, shared) institution vaults list. Streaming them
// inside the layout's Suspense keeps the layout body cheap so each tab's content can render in
// parallel rather than blocking on this fetch.
export const InstitutionTabsHeader = async ({ institutionName }: { institutionName: string }) => {
  const institutionVaults = await getCachedInstitutionVaults({ institutionName })

  if (!institutionVaults?.vaults) {
    return <div>Institution not found.</div>
  }

  const performanceValues = institutionVaults.vaults
    .map((vault) => getVaultPerformance(vault))
    .filter((perf): perf is number => perf !== null)

  const allTimePerformance =
    performanceValues.length > 0
      ? performanceValues.reduce((acc, perf) => acc + perf, 0) / performanceValues.length
      : null

  return (
    <>
      <TopBlocks
        blocks={[
          {
            title: 'Total value',
            value: `${formatCryptoBalance(
              institutionVaults.vaults.reduce(
                (acc, vault) => acc + (Number(vault.totalValueLockedUSD) || 0),
                0,
              ),
              '$',
            )}`,
            colorful: true,
          },
          {
            title: 'Number of vaults',
            value: institutionVaults.vaults.length,
          },
          {
            title: '30d avg APY',
            value: formatPercent(
              institutionVaults.vaultsAdditionalInfo.vaultsApyAverages.apy30d ?? 0,
              {
                precision: 2,
              },
            ),
          },
          {
            title: 'All time performance',
            value:
              allTimePerformance !== null
                ? formatPercent(allTimePerformance, { precision: 2 })
                : 'n/a',
          },
        ]}
      />
      <InstitutionTabBar
        institutionName={institutionName}
        defaultVault={institutionVaults.vaults[0]}
        tabBarStyle={tabBarStyle}
      />
    </>
  )
}

export const InstitutionTabsHeaderSkeleton = () => (
  <div className={topBlocksStyles.topBlocksWrapper}>
    {TOP_BLOCK_KEYS.map((key) => (
      <Card
        key={key}
        variant="cardSecondary"
        className={topBlocksStyles.tobBlockItem}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
      >
        <SkeletonLine height={14} width={100} />
        <SkeletonLine height={28} width={140} />
      </Card>
    ))}
  </div>
)
