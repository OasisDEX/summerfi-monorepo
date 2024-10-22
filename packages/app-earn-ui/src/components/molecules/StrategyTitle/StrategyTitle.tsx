import { type FC, type ReactNode } from 'react'
import { NetworkIds, NetworkNames, type TokenSymbolsList } from '@summerfi/app-types'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon.tsx'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { getTokenGuarded } from '@/tokens/helpers'

const networkIdIconMap = {
  [NetworkIds.MAINNET]: <Icon iconName="network_ethereum" size={16} />,
  [NetworkIds.BASEMAINNET]: <Icon iconName="network_base" size={16} />,
  [NetworkIds.ARBITRUMMAINNET]: <Icon iconName="network_arbitrum" size={16} />,
  [NetworkIds.OPTIMISMMAINNET]: <Icon iconName="network_optimism" size={16} />,
}

const networkNameIconMap = {
  [NetworkNames.ethereumMainnet]: <Icon iconName="network_ethereum" size={16} />,
  [NetworkNames.baseMainnet]: <Icon iconName="network_base" size={16} />,
  [NetworkNames.arbitrumMainnet]: <Icon iconName="network_arbitrum" size={16} />,
  [NetworkNames.optimismMainnet]: <Icon iconName="network_optimism" size={16} />,
}

interface StrategyTitleProps {
  symbol: TokenSymbolsList
  networkId?: NetworkIds
  networkName?: NetworkNames
  value?: ReactNode
}

export const StrategyTitle: FC<StrategyTitleProps> = ({
  symbol,
  value,
  networkId,
  networkName,
}) => {
  const isIconDefined = getTokenGuarded(symbol)?.iconName

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {isIconDefined ? (
          <Icon tokenName={symbol} variant="xxl" />
        ) : (
          <GenericTokenIcon symbol={symbol} customSize={32} />
        )}
        {(networkId ?? networkName) && (
          <div style={{ position: 'absolute', top: '-3px', left: '-3px' }}>
            {networkId && networkIdIconMap[networkId]}
            {networkName && networkNameIconMap[networkName]}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="h4" variant="h4" style={{ color: 'white', fontSize: '24px', lineHeight: '30px' }}>
          {symbol}
        </Text>
        {value && <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>{value}</div>}
      </div>
    </div>
  )
}
