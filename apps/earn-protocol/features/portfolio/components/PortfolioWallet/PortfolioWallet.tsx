import { CryptoUtilities } from '@/features/crypto-utilities/components/CryptoUtilities/CryptoUtilities'
import { PortfolioStrategiesCarousel } from '@/features/portfolio/components/PortfolioStrategiesCarousel/PortfolioStrategiesCarousel'

export const PortfolioWallet = () => {
  return (
    <div>
      <PortfolioStrategiesCarousel
        style={{ marginBottom: 'var(--general-space-24)', marginTop: 'var(--general-space-24)' }}
      />
      <CryptoUtilities />
    </div>
  )
}
