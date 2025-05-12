import { type FC } from 'react'
import Image from 'next/image'

import { Pill } from '@/components/atoms/Pill/Pill'
import { Text } from '@/components/atoms/Text/Text'

import protocolLabelStyles from '@/components/molecules/ProtocolLabel/ProtocolLabel.module.css'

interface ProtocolLabelProps {
  protocol: {
    label: string
    logo: {
      scale: number
      src: string
    }
  }
  network?: {
    badge: string
    label: string
  }
}

const sizeBase = 55

export const ProtocolLabel: FC<ProtocolLabelProps> = ({
  network,
  protocol,
}: ProtocolLabelProps) => {
  return (
    <Pill variant={network ? 'smallRightPadding' : 'default'}>
      <Text variant="hidden">{protocol.label}</Text>
      <Image src={protocol.logo.src} alt={protocol.label} width={sizeBase * protocol.logo.scale} />
      {network && (
        <div className={protocolLabelStyles.networkWrapper}>
          <div className={protocolLabelStyles.networkIconWrapper}>
            <Image src={network.badge} alt={network.label} fill />
          </div>
        </div>
      )}
    </Pill>
  )
}
