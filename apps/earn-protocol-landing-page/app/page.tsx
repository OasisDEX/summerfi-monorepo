import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import {
  BigGradientBox,
  EffortlessAccessBlock,
  LandingPageHero,
} from '@/components/layout/LandingPageContent'

export const revalidate = 60

export default async function HomePage() {
  const { vaults } = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageHero vaultsList={vaults} />
      <BigGradientBox>
        <EffortlessAccessBlock />
      </BigGradientBox>
    </div>
  )
}
