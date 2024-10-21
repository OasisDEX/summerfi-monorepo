'use client'
import { type CSSProperties, type FC, useState } from 'react'
import { Card, DataBlock, Icon, StrategyTitle, Text } from '@summerfi/app-earn-ui'
import { NetworkNames, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import classNames from './PortfolioAssetsList.module.scss'

const assets: {
  token: TokenSymbolsList
  price24h: string
  change: string
  usdValue: string
  balance: string
  network: NetworkNames
}[] = [
  {
    token: 'USDC',
    price24h: '5',
    change: '0.001',
    usdValue: '100000',
    balance: '100000',
    network: NetworkNames.ethereumMainnet,
  },
  {
    token: 'USDT',
    price24h: '5',
    change: '-0.002',
    usdValue: '10000',
    balance: '10000',
    network: NetworkNames.baseMainnet,
  },
  {
    token: 'DAI',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
    network: NetworkNames.optimismMainnet,
  },
  {
    token: 'ETH',
    price24h: '5',
    change: '-0.001',
    usdValue: '1000',
    balance: '1000',
    network: NetworkNames.ethereumMainnet,
  },
  {
    token: 'WBTC',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
    network: NetworkNames.ethereumMainnet,
  },
  {
    token: 'WSTETH',
    price24h: '5',
    change: '0.001',
    usdValue: '1000',
    balance: '1000',
    network: NetworkNames.ethereumMainnet,
  },
]

const dataBlocksStyles: {
  valueStyle: CSSProperties
  titleStyle: CSSProperties
} = {
  valueStyle: { textAlign: 'right' },
  titleStyle: { textAlign: 'right', width: '100%' },
}

interface AssetPriceChangeTrendProps {
  change: string
}

const AssetPriceChangeTrend: FC<AssetPriceChangeTrendProps> = ({ change }) => {
  const resolvedChange = new BigNumber(change)

  const color = resolvedChange.gt(0) ? 'rgba(105, 223, 49, 1)' : 'rgba(255, 87, 57, 1)'

  return (
    <>
      <Text as="p" variant="p3" style={{ color }}>
        {formatDecimalAsPercent(resolvedChange)}
      </Text>
      <Icon
        iconName={resolvedChange.gt(0) ? 'arrow_increase' : 'arrow_decrease'}
        variant="xxs"
        color={color}
      />
    </>
  )
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
              <StrategyTitle
                symbol={item.token}
                networkName={item.network}
                value={<AssetPriceChangeTrend change={item.change} />}
              />
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
