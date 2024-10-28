import { Carousel, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { LandingPageVaultPicker } from '@/components/organisms/LandingPageVaultPicker/LandingPageVaultPicker'

import classNames from '@/components/layout/LandingPageContent/LandingPageContent.module.scss'

export const LandingPageContent = ({ vaultsList }: { vaultsList: SDKVaultsListType }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className={classNames.pageHeader}>
        <Text
          as="h1"
          variant="h1"
          style={{ color: 'var(--earn-protocol-secondary-100)', textAlign: 'center' }}
        >
          Automated Exposure to DeFi’s
        </Text>
        <Text
          as="h1"
          variant="h1"
          style={{ color: 'var(--earn-protocol-primary-100)', textAlign: 'center' }}
        >
          Highest Quality Yield
        </Text>
      </div>
      <Carousel
        components={vaultsList.map((vault) => (
          <LandingPageVaultPicker vault={vault} key={vault.id} />
        ))}
        contentWidth={515}
      />
    </div>
  )
}
