'use client'
import { type CSSProperties, type FC, useState } from 'react'
import { Card, DataBlock, Icon, StrategyTitle, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type PortfolioWalletAsset } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { valueColorResolver } from '@/helpers/value-color-resolver'

import classNames from './PortfolioAssetsList.module.scss'

const dataBlocksStyles: {
  valueStyle: CSSProperties
  titleStyle: CSSProperties
} = {
  valueStyle: { textAlign: 'right' },
  titleStyle: { textAlign: 'right', width: '100%' },
}

interface AssetPriceChangeTrendProps {
  change: number | undefined
}

const AssetPriceChangeTrend: FC<AssetPriceChangeTrendProps> = ({ change }) => {
  const resolvedChange = new BigNumber(change ?? 0)

  const color = valueColorResolver(resolvedChange)

  return (
    <>
      <Text as="p" variant="p3" style={{ color }}>
        {formatDecimalAsPercent(resolvedChange)}
      </Text>
      {!resolvedChange.isZero() && (
        <Icon
          iconName={resolvedChange.gt(0) ? 'arrow_increase' : 'arrow_decrease'}
          variant="xxs"
          color={color}
        />
      )}
    </>
  )
}

interface PortfolioAssetsListProps {
  walletAssets: PortfolioWalletAsset[]
}

export const PortfolioAssetsList: FC<PortfolioAssetsListProps> = ({ walletAssets }) => {
  const [isSeeAll, setIsSeeAll] = useState(false)

  return (
    <div className={classNames.wrapper}>
      <div
        className={`${classNames.assetsWrapper} ${isSeeAll ? classNames.assetsWrapperExpanded : ''}`}
      >
        {walletAssets.slice(0, isSeeAll ? walletAssets.length : 3).map((item) => (
          <Card
            key={item.symbol + item.network + item.balance}
            variant="cardSecondary"
            className={classNames.assetWrapper}
          >
            <div className={classNames.tokenBlockWrapper}>
              <StrategyTitle
                symbol={item.symbol}
                networkName={item.network}
                value={<AssetPriceChangeTrend change={item.price24hChange} />}
              />
            </div>
            <div className={classNames.dataBlockWrapper}>
              <DataBlock
                title="Price (24h)"
                value={`$${formatFiatBalance(new BigNumber(item.priceUSD))}`}
                {...dataBlocksStyles}
              />
              <DataBlock
                title="USD Value"
                value={`$${formatFiatBalance(new BigNumber(item.balanceUSD))}`}
                {...dataBlocksStyles}
              />
              <DataBlock
                title="Token Balance"
                value={`${formatCryptoBalance(new BigNumber(item.balance))} ${item.symbol}`}
                {...dataBlocksStyles}
              />
            </div>
          </Card>
        ))}
      </div>
      {walletAssets.length === 0 && (
        <Text as="p" variant="p1">
          No assets available to display
        </Text>
      )}
      {walletAssets.length > 3 && (
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
      )}
    </div>
  )
}
