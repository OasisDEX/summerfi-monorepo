import { LandingPageContent } from '@/components/layout/LandingPageContent/LandingPageContent'
import { getVaultsList } from '@/server-handlers/sdk/getVaultsList'

export default async function HomePage() {
  const strategiesList = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageContent strategiesList={strategiesList} />
    </div>
  )
}
