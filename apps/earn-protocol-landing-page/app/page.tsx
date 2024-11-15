import { BallBlob } from '@summerfi/app-earn-ui'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { LandingPageContent } from '@/components/layout/LandingPageContent/LandingPageContent'

export const revalidate = 60

export default async function HomePage() {
  const { vaults } = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <BallBlob />
      <LandingPageContent vaultsList={vaults} />
    </div>
  )
}
