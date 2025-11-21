import { formatCryptoBalance, formatPercent } from '@summerfi/app-utils'

import { getInstitutionVaults } from '@/app/server-handlers/institution/institution-vaults'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'
import { TopBlocks } from '@/components/layout/TopBlocks/TopBlocks'
import { PanelsProvider } from '@/providers/PanelsProvider/PanelsProvider'

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
            value: formatPercent(institutionVaults.vaultApysAverage.apy30d ?? 0, {
              precision: 2,
            }),
          },
          {
            title: 'All time performance',
            value: 'n/a',
          },
        ]}
      />
      <InstitutionTabBar
        institutionName={institutionName}
        defaultVault={institutionVaults.vaults[0]}
      />
      <PanelsProvider>
        <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
      </PanelsProvider>
    </>
  )
}
