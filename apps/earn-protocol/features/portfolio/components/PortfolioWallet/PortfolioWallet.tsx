import { type FC } from 'react'
import { type GetVaultsApyResponse, type SDKVaultsListType } from '@summerfi/app-types'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/cached/get-wallet-assets/types'
import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'

import classNames from './PorftolioWallet.module.css'

interface PortfolioWalletProps {
  walletData: PortfolioAssetsResponse
  vaultsList: SDKVaultsListType
  vaultsApyByNetworkMap: GetVaultsApyResponse
  sumrPriceUsd: number
}

export const PortfolioWallet: FC<PortfolioWalletProps> = ({
  walletData,
  vaultsList,
  vaultsApyByNetworkMap,
  sumrPriceUsd,
}) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets walletData={walletData} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <PortfolioVaultsCarousel
        className={classNames.vaultCarousel}
        vaultsList={vaultsList}
        vaultsApyByNetworkMap={vaultsApyByNetworkMap}
        carouselId="portfolio-wallet-vaults-carousel"
        sumrPriceUsd={sumrPriceUsd}
      />
    </div>
  )
}
