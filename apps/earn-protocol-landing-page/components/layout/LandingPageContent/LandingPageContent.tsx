import { Carousel, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { LandingPageStrategyPicker } from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker'

import classNames from '@/components/layout/LandingPageContent/LandingPageContent.module.scss'

export const LandingPageContent = ({ strategiesList }: { strategiesList: SDKVaultsListType }) => {
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
        components={strategiesList.map((strategy) => (
          <LandingPageStrategyPicker strategy={strategy} key={strategy.id} />
        ))}
        contentWidth={515}
      />
    </div>
  )
}
