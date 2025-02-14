import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import arbitrumLogo from '@/public/img/landing-page/networks/arbitrum.svg'
import baseLogo from '@/public/img/landing-page/networks/base.svg'
import ethereumLogo from '@/public/img/landing-page/networks/ethereum.svg'

import supportedNetworksListStyles from '@/components/layout/LandingPageContent/content/SupportedNetworksList.module.scss'

export const SupportedNetworksList = () => {
  return (
    <div className={supportedNetworksListStyles.availableNetworksList}>
      <Text variant="p1">Available on</Text>
      <Image src={ethereumLogo} alt="Ethereum" />
      <Image src={baseLogo} alt="Base" />
      <Image src={arbitrumLogo} alt="Arbitrum" />
    </div>
  )
}
