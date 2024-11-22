import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import arbitrumLogo from '@/public/img/landing-page/networks/arbitrum.svg'
import ethereumLogo from '@/public/img/landing-page/networks/ethereum.svg'
import optimismLogo from '@/public/img/landing-page/networks/optimism.svg'

import supportedNetworksListStyles from './SupportedNetworksList.module.scss'

export const SupportedNetworksList = () => {
  return (
    <div className={supportedNetworksListStyles.availableNetworksList}>
      <Text variant="p1">Available on</Text>
      <Image src={ethereumLogo} alt="Ethereum" />
      <Image src={optimismLogo} alt="Optimism" />
      <Image src={arbitrumLogo} alt="Arbitrum" />
    </div>
  )
}
