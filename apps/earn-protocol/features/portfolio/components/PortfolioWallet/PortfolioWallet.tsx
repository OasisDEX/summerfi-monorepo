import { type FC } from 'react'
import {
  type GetVaultsApyResponse,
  type RewardTokenPrices,
  type SDKVaultsListType,
} from '@summerfi/app-types'

import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'

import classNames from './PorftolioWallet.module.css'

interface PortfolioWalletProps {
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  rewardTokenPrices: RewardTokenPrices
  viewWalletAddress: string
}

export const PortfolioWallet: FC<PortfolioWalletProps> = ({
  vaultsList,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  viewWalletAddress,
}) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets viewWalletAddress={viewWalletAddress} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <PortfolioVaultsCarousel
        className={classNames.vaultCarousel}
        vaultsList={vaultsList}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        carouselId="portfolio-wallet-vaults-carousel"
        rewardTokenPrices={rewardTokenPrices}
      />
    </div>
  )
}
