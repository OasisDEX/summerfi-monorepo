import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import arbitrumLogo from '@/public/img/landing-page/networks/arbitrum.svg'
import baseLogo from '@/public/img/landing-page/networks/base.svg'
import ethereumLogo from '@/public/img/landing-page/networks/ethereum.svg'

import supportedNetworksListStyles from '@/components/layout/LandingPageContent/content/SupportedNetworksList.module.css'

export const SupportedNetworksList = () => {
  return (
    <div className={supportedNetworksListStyles.availableNetworksList}>
      <Text variant="p1">Available on</Text>
      <div className={supportedNetworksListStyles.networkImages}>
        <Image
          src={ethereumLogo}
          alt="Ethereum"
          className={supportedNetworksListStyles.networkLogo}
          width={32}
          height={32}
        />
        <Image
          src={baseLogo}
          alt="Base"
          className={supportedNetworksListStyles.networkLogo}
          width={32}
          height={32}
        />
        <Image
          src={arbitrumLogo}
          alt="Arbitrum"
          className={supportedNetworksListStyles.networkLogo}
          width={32}
          height={32}
        />
      </div>
    </div>
  )
}
