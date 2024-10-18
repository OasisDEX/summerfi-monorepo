import { CryptoUtilities } from '@/features/crypto-utilities/components/CryptoUtilities/CryptoUtilities'
import { PortfolioAssets } from '@/features/portfolio/components/PortfolioAssets/PortfolioAssets'
import { PortfolioStrategiesCarousel } from '@/features/portfolio/components/PortfolioStrategiesCarousel/PortfolioStrategiesCarousel'

import classNames from './PorftolioWallet.module.scss'

export const PortfolioWallet = () => {
  return (
    <div className={classNames.wrapper}>
      <PortfolioAssets />
      <PortfolioStrategiesCarousel
        style={{ marginBottom: 'var(--general-space-24)', marginTop: 'var(--general-space-24)' }}
      />
      <CryptoUtilities />
    </div>
  )
}
