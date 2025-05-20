import { type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'

import { Text } from '@/components/atoms/Text/Text'

import supportedNetworksListStyles from './SupportedNetworksList.module.css'

export const SupportedNetworksList = ({
  networks,
}: {
  networks: {
    name: string
    logo: StaticImageData
  }[]
}): ReactNode => {
  return (
    <div className={supportedNetworksListStyles.availableNetworksList}>
      <Text variant="p1">Available on</Text>
      <div className={supportedNetworksListStyles.networkImages}>
        {networks.map((network) => (
          <Image
            key={network.name}
            src={network.logo}
            alt={network.name}
            className={supportedNetworksListStyles.networkLogo}
            width={32}
            height={32}
          />
        ))}
      </div>
    </div>
  )
}
