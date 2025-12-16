import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'

import { getInstitutionVaults } from '@/app/server-handlers/institution/institution-vaults'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'
import { TopBlocks } from '@/components/layout/TopBlocks/TopBlocks'
import { getVaultPerformance } from '@/helpers/get-vault-performance'

export default async function InstitutionTabLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionName: string }>
}) {
  const [{ institutionName }] = await Promise.all([params])
  const [institutionVaults] = await Promise.all([getInstitutionVaults({ institutionName })])

  if (!institutionName || !institutionVaults?.vaults) {
    // Handle institution not found
    return <div>Institution not found.</div>
  }

  const allTimePerformance = Number(
    institutionVaults.vaults.reduce((acc, vault) => {
      const vaultPerformance = getVaultPerformance(vault)

      if (vaultPerformance !== null) {
        return acc + vaultPerformance
      }

      return acc
    }, 0) / institutionVaults.vaults.length,
  )

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
            value: formatPercent(allTimePerformance, { precision: 2 }),
          },
        ]}
      />
      <InstitutionTabBar
        institutionName={institutionName}
        defaultVault={institutionVaults.vaults[0]}
        tabBarStyle={{
          paddingTop: 'var(--spacing-space-medium)',
          position: 'sticky',
          top: 0,
          zIndex: 10000, // has to be above chart tooltips, otherwise it looks weird
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(28,28,28, 0.5)',
        }}
      />
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </>
  )
}
