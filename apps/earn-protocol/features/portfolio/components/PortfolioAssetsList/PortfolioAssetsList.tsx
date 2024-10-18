'use client'
import { type CSSProperties, useState } from 'react'
import { Card, DataBlock, Icon, StrategyTitleWithRisk, Text } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import classNames from './PortfolioAssetsList.module.scss'

const assets: {
  token: TokenSymbolsList
  price24h: string
  change: string
  usdValue: string
  balance: string
}[] = [
  {
    token: 'USDC',
    price24h: '5',
    change: '0.001',
    usdValue: '100000',
    balance: '100000',
  },
  {
    token: 'USDT',
    price24h: '5',
    change: '0.001',
    usdValue: '10000',
    balance: '10000',
  },
  {
    token: 'DAI',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
  },
  {
    token: 'ETH',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
  },
  {
    token: 'WBTC',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
  },
  {
    token: 'WSTETH',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
  },
]

const dataBlocksStyles: {
  valueStyle: CSSProperties
  titleStyle: CSSProperties
} = {
  valueStyle: { textAlign: 'right' },
  titleStyle: { textAlign: 'right', width: '100%' },
}

export const PortfolioAssetsList = () => {
  const [isSeeAll, setIsSeeAll] = useState(false)

  return (
    <div className={classNames.wrapper}>
      <div
        className={`${classNames.assetsWrapper} ${isSeeAll ? classNames.assetsWrapperExpanded : ''}`}
      >
        {assets.slice(0, isSeeAll ? assets.length : 3).map((item) => (
          <Card key={item.token} variant="cardSecondary" className={classNames.assetWrapper}>
            <div className={classNames.tokenBlockWrapper}>
              <StrategyTitleWithRisk symbol={item.token} risk="low" />
            </div>
            <div className={classNames.dataBlockWrapper}>
              <DataBlock
                title="Price (24h)"
                value={`$${formatFiatBalance(new BigNumber(item.price24h))}`}
                {...dataBlocksStyles}
              />
              <DataBlock
                title="USD Value"
                value={`$${formatFiatBalance(new BigNumber(item.usdValue))}`}
                {...dataBlocksStyles}
              />
              <DataBlock
                title="Token Balance"
                value={`${formatCryptoBalance(new BigNumber(item.usdValue))} ${item.token}`}
                {...dataBlocksStyles}
              />
            </div>
          </Card>
        ))}
      </div>
      <div onClick={() => setIsSeeAll((prev) => !prev)} className={classNames.linkWrapper}>
        <Text as="p" variant="p3semi">
          {isSeeAll ? 'Hide' : 'See'} all assets
        </Text>
        <Icon
          iconName={isSeeAll ? 'chevron_up' : 'chevron_down'}
          variant="xs"
          color="rgba(255, 73, 164, 1)"
        />
      </div>
    </div>
  )
}
