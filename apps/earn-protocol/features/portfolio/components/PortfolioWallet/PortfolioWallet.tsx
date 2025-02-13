import { type FC } from 'react'
import { type SDKVaultsListType } from '@summerfi/app-types'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioVaultsCarousel } from '@/features/portfolio/components/PortfolioVaultsCarousel/PortfolioVaultsCarousel'

import classNames from './PorftolioWallet.module.scss'

interface PortfolioWalletProps {
  walletData: PortfolioAssetsResponse
  vaultsList: SDKVaultsListType
}

export const PortfolioWallet: FC<PortfolioWalletProps> = ({ walletData, vaultsList }) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets walletData={walletData} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <PortfolioVaultsCarousel className={classNames.vaultCarousel} vaultsList={vaultsList} />
      {/* <CryptoUtilities /> */}
    </div>
  )
}
