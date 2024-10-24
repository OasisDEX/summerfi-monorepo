import { type FC } from 'react'

import { type PortfolioAssetsResponse } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { CryptoUtilities } from '@/features/crypto-utilities/components/CryptoUtilities/CryptoUtilities'
import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioStrategiesCarousel } from '@/features/portfolio/components/PortfolioStrategiesCarousel/PortfolioStrategiesCarousel'

import classNames from './PorftolioWallet.module.scss'

interface PortfolioWalletProps {
  walletData: PortfolioAssetsResponse
}

export const PortfolioWallet: FC<PortfolioWalletProps> = ({ walletData }) => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets walletData={walletData} />
      <PortfolioStrategiesCarousel className={classNames.strategyCarousel} />
      <CryptoUtilities />
    </div>
  )
}
