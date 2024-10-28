import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { LandingPageContent } from '@/components/layout/LandingPageContent/LandingPageContent'

export const revalidate = 60

export default async function HomePage() {
  const { vaults } = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageContent vaultsList={vaults} />
    </div>
  )
}
