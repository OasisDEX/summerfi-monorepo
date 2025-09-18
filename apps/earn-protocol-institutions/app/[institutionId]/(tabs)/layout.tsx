import { formatCryptoBalance } from '@summerfi/app-utils'

import { getInstitutionVaults } from '@/app/server-handlers/institution-vaults'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'
import { TopBlocks } from '@/components/layout/TopBlocks/TopBlocks'
import { PanelsProvider } from '@/providers/PanelsProvider/PanelsProvider'

export default async function InstitutionTabLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }] = await Promise.all([params])
  const [institutionVaults] = await Promise.all([getInstitutionVaults({ institutionId })])

  if (!institutionId || !institutionVaults?.vaults) {
    // Handle institution not found
    return <div>Institution not found.</div>
  }

  return (
    <PanelsProvider>
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
            title: '30d ave APY',
            value: '5.25%',
          },
          {
            title: 'All time performance',
            value: '+11.15%',
          },
        ]}
      />
      <InstitutionTabBar institutionId={institutionId} defaultVault={institutionVaults.vaults[0]} />
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </PanelsProvider>
  )
}
