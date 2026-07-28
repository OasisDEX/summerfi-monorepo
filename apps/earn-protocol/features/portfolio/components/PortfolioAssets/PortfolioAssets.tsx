import { type FC, type ReactNode, useMemo, useState } from 'react'
import { DataBlock, Icon, PillSelector, SkeletonLine } from '@summerfi/app-earn-ui'
import { NetworkNames } from '@summerfi/app-types'
import { formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { usePortfolioWalletDataQuery } from '@/features/portfolio/api/get-portfolio-wallet-data'
import { PortfolioAssetsList } from '@/features/portfolio/components/PortfolioAssetsList/PortfolioAssetsList'
import { valueColorResolver } from '@/helpers/value-color-resolver'

import classNames from './PotfolioAssets.module.css'

type PortfolioAssetNetworkOption = NetworkNames | 'all'

const networks: { value: PortfolioAssetNetworkOption; icon?: ReactNode; label?: string }[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: NetworkNames.ethereumMainnet,
    icon: <Icon iconName="earn_network_ethereum" variant="m" />,
  },
  {
    value: NetworkNames.baseMainnet,
    icon: <Icon iconName="earn_network_base" variant="m" />,
  },
  {
    value: NetworkNames.optimismMainnet,
    icon: <Icon iconName="earn_network_optimism" variant="m" />,
  },
  {
    value: NetworkNames.arbitrumMainnet,
    icon: <Icon iconName="earn_network_arbitrum" variant="m" />,
  },
  {
    value: NetworkNames.sonicMainnet,
    icon: <Icon iconName="earn_network_sonic" variant="m" />,
  },
  {
    value: NetworkNames.hyperliquid,
    icon: <Icon iconName="earn_network_hyperliquid" variant="m" />,
  },
]

interface PortfolioAssetsProps {
  viewWalletAddress: string
}

export const PortfolioAssets: FC<PortfolioAssetsProps> = ({ viewWalletAddress }) => {
  const {
    data: portfolioWalletData,
    isError: isWalletDataError,
    isPending: isWalletDataPending,
  } = usePortfolioWalletDataQuery(viewWalletAddress)

  const walletData = portfolioWalletData?.walletData

  const [network, setNetwork] = useState<PortfolioAssetNetworkOption>(networks[0].value)

  const resolvedWalletAssets = useMemo(() => {
    if (network === 'all') {
      return walletData?.assets
    }

    return walletData?.assets.filter((asset) => asset.network === network)
  }, [network, walletData])

  const totalAssetsAmountChange = useMemo(
    () =>
      walletData?.assets.length
        ? walletData.assets
            .filter((token) => token.price24hChange != null)
            .reduce((acc, token) => acc + (token.price24hChange ?? 0), 0) / walletData.assets.length
        : 0,
    [walletData?.assets],
  )

  if (isWalletDataError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-space-x-small)',
        }}
      >
        <Icon iconName="question_o" variant="l" />
        <span
          style={{
            color: 'var(--earn-protocol-secondary-100)',
          }}
        >
          Failed to load wallet assets
        </span>
      </div>
    )
  }

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.headerWrapper}>
        <DataBlock
          title="Total Assets"
          value={
            isWalletDataPending ? (
              <SkeletonLine width={140} height={35} style={{ margin: '0 0 5px 0' }} />
            ) : walletData?.totalAssetsUsdValue ? (
              `$${formatFiatBalance(walletData.totalAssetsUsdValue)}`
            ) : (
              '$0.00'
            )
          }
          subValue={
            isWalletDataPending ? (
              <SkeletonLine width={100} height={19} style={{ margin: '0 0 5px 0' }} />
            ) : (
              `${formatDecimalAsPercent(totalAssetsAmountChange, { plus: true })} Past week`
            )
          }
          titleSize="large"
          valueSize="large"
          subValueSize="medium"
          subValueStyle={{ color: valueColorResolver(new BigNumber(totalAssetsAmountChange)) }}
        />
        <PillSelector
          options={networks}
          onSelect={(newNetwork) => {
            setNetwork(newNetwork as PortfolioAssetNetworkOption)
          }}
          defaultSelected={network}
        />
      </div>
      <PortfolioAssetsList
        walletAssets={resolvedWalletAssets}
        isWalletDataPending={isWalletDataPending}
      />
    </div>
  )
}
