'use client'
import { type CSSProperties, type FC, useState } from 'react'
import {
  AnimateHeight,
  Card,
  DataBlock,
  getDisplayToken,
  Icon,
  Text,
  VaultTitle,
} from '@summerfi/app-earn-ui'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  networkNameToSDKNetwork,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { type PortfolioWalletAsset } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { valueColorResolver } from '@/helpers/value-color-resolver'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import classNames from './PortfolioAssetsList.module.css'

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

const mapAssetCardItem = (item: PortfolioWalletAsset) => (
  <Card
    key={item.symbol + item.network + item.balance}
    variant="cardSecondary"
    className={classNames.assetWrapper}
  >
    <div className={classNames.tokenBlockWrapper}>
      <VaultTitle
        symbol={item.symbol}
        networkName={networkNameToSDKNetwork(item.network)}
        value={<AssetPriceChangeTrend change={item.price24hChange} />}
      />
    </div>
    <div className={classNames.dataBlockWrapper}>
      <DataBlock
        title="Price (24h)"
        value={`$${formatFiatBalance(item.priceUSD)}`}
        {...dataBlocksStyles}
      />
      <DataBlock
        title="USD Value"
        value={`$${formatFiatBalance(item.balanceUSD)}`}
        {...dataBlocksStyles}
      />
      <DataBlock
        title="Token Balance"
        value={`${formatCryptoBalance(item.balance)} ${getDisplayToken(item.symbol)}`}
        {...dataBlocksStyles}
      />
    </div>
  </Card>
)

export const PortfolioAssetsList: FC<PortfolioAssetsListProps> = ({ walletAssets }) => {
  const [isSeeAll, setIsSeeAll] = useState(false)
  const buttonClickEventHandler = useHandleButtonClickEvent()

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.assetsWrapper}>
        {walletAssets.slice(0, 3).map(mapAssetCardItem)}
        <AnimateHeight
          id="portfolio-all-assets"
          show={isSeeAll}
          fade={false}
          className={classNames.assetsWrapperAnimatedHeight}
        >
          {walletAssets.slice(3).map(mapAssetCardItem)}
        </AnimateHeight>
      </div>
      {walletAssets.length === 0 && (
        <Text as="p" variant="p1">
          No assets available to display
        </Text>
      )}
      {walletAssets.length > 3 && (
        <div
          onClick={() => {
            buttonClickEventHandler(`portfolio-wallet-see-all-${isSeeAll ? 'hide' : 'show'}`)
            setIsSeeAll((prev) => !prev)
          }}
          className={classNames.linkWrapper}
        >
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
