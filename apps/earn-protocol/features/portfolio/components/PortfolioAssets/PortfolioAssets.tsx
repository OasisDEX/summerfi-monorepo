import { type FC, type ReactNode, useMemo, useState } from 'react'
import { DataBlock, Icon, PillSelector } from '@summerfi/app-earn-ui'
import { NetworkNames } from '@summerfi/app-types'
import { formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { PortfolioAssetsList } from '@/features/portfolio/components/PortfolioAssetsList/PortfolioAssetsList'
import { valueColorResolver } from '@/helpers/value-color-resolver'
import { type PortfolioAssetsResponse } from '@/server-handlers/portfolio/portfolio-wallet-assets-handler'

import classNames from './PotfolioAssets.module.scss'

type PortfolioAssetNetworkOption = NetworkNames | 'all'

const networks: { value: PortfolioAssetNetworkOption; icon?: ReactNode; label?: string }[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: NetworkNames.ethereumMainnet,
    icon: <Icon iconName="network_ethereum" variant="m" />,
  },
  {
    value: NetworkNames.baseMainnet,
    icon: <Icon iconName="network_base" variant="m" />,
  },
  {
    value: NetworkNames.optimismMainnet,
    icon: <Icon iconName="network_optimism" variant="m" />,
  },
  {
    value: NetworkNames.arbitrumMainnet,
    icon: <Icon iconName="network_arbitrum" variant="m" />,
  },
]

interface PortfolioAssetsProps {
  walletData: PortfolioAssetsResponse
}

export const PortfolioAssets: FC<PortfolioAssetsProps> = ({ walletData }) => {
  const [network, setNetwork] = useState<PortfolioAssetNetworkOption>(networks[0].value)

  const resolvedWalletAssets = useMemo(() => {
    if (network === 'all') {
      return walletData.assets
    }

    return walletData.assets.filter((asset) => asset.network === network)
  }, [network, walletData])

  const totalAssetsAmountChange = useMemo(
    () =>
      walletData.assets.length
        ? walletData.assets
            .filter((token) => token.price24hChange != null)
            .reduce((acc, token) => acc + (token.price24hChange ?? 0), 0) / walletData.assets.length
        : 0,
    [walletData.assets],
  )

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.headerWrapper}>
        <DataBlock
          title="Total Assets"
          value={`$${formatFiatBalance(new BigNumber(walletData.totalAssetsUsdValue))}`}
          subValue={`${formatDecimalAsPercent(new BigNumber(totalAssetsAmountChange), { plus: true })} Past week`}
          titleSize="large"
          valueSize="large"
          subValueSize="small"
          subValueStyle={{ color: valueColorResolver(new BigNumber(totalAssetsAmountChange)) }}
        />
        <PillSelector
          options={networks}
          onSelect={(newNetwork) => setNetwork(newNetwork as PortfolioAssetNetworkOption)}
          defaultSelected={network}
        />
      </div>
      <PortfolioAssetsList walletAssets={resolvedWalletAssets} />
    </div>
  )
}