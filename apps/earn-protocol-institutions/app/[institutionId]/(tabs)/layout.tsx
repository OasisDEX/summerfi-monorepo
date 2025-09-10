import { getInstitutionVaults } from '@/app/server-handlers/institution-vaults'
import { InstitutionTabBar } from '@/components/layout/TabBar/InstitutionTabBar'
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
      <InstitutionTabBar institutionId={institutionId} defaultVault={institutionVaults.vaults[0]} />
      <div style={{ padding: 'var(--general-space-24) 0' }}>{children}</div>
    </PanelsProvider>
  )
}
