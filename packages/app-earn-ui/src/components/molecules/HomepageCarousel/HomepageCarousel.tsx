import { type SDKVaultishType, type VaultApyData } from '@summerfi/app-types'

import { SlideCarousel } from '@/components/molecules/SlideCarousel/SlideCarousel'
import { VaultCardHomepage } from '@/components/molecules/VaultCardHomepage/VaultCardHomepage'

import homepageCarouselStyles from './HomepageCarousel.module.scss'

type HomepageCarouselProps = {
  vaultsList: SDKVaultishType[]
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
}

export const HomepageCarousel = ({ vaultsList, vaultsApyByNetworkMap }: HomepageCarouselProps) => {
  return (
    <div className={homepageCarouselStyles.homepageCarouselWrapper}>
      <SlideCarousel
        withButtons={false}
        withAutoPlay={false}
        withDots={false}
        slidesPerPage={1}
        dimInactive
        options={{
          align: 'center',
          loop: true,
        }}
        slides={vaultsList.map((vault) => (
          <VaultCardHomepage
            key={`VaultCardHomepage_${vault.id}_${vault.protocol.network}`}
            vault={vault}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
          />
        ))}
      />
    </div>
  )
}
