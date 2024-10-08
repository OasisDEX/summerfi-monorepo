'use client'
import { Carousel, Text } from '@summerfi/app-earn-ui'
import { type DropdownOption, type Risk, type TokenSymbolsList } from '@summerfi/app-types'

import { LandingPageStrategyPicker } from '@/components/organisms/LandingPageStrategyPicker/LandingPageStrategyPicker'

import classNames from '@/components/layout/LandingPageContent/LandingPageContent.module.scss'

const options: DropdownOption[] = [
  { label: 'DAI', value: 'DAI', tokenSymbol: 'DAI' },
  { label: 'USDC', value: 'USDC', tokenSymbol: 'USDC' },
  { label: 'USDT', value: 'USDT', tokenSymbol: 'USDT' },
]

const content: {
  id: string
  apy: string
  symbol: TokenSymbolsList
  risk: Risk
  totalAssets: string
  bestFor: string
  options: DropdownOption[]
}[] = [
  {
    id: '1',
    apy: '9.3',
    symbol: 'USDC',
    risk: 'high',
    totalAssets: '800,130,321',
    bestFor: '$800,130,321',
    options,
  },
  {
    id: '2',
    apy: '6.3',
    symbol: 'DAI',
    risk: 'medium',
    totalAssets: '800,130,321',
    bestFor: '$800,130,321',
    options,
  },
  {
    id: '3',
    apy: '7.3',
    symbol: 'USDT',
    risk: 'low',
    totalAssets: '800,130,321',
    bestFor: '$800,130,321',
    options,
  },
]

export const LandingPageContent = () => {
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
        components={content.map((item) => (
          <LandingPageStrategyPicker {...item} key={item.id} />
        ))}
        contentWidth={515}
      />
    </div>
  )
}
