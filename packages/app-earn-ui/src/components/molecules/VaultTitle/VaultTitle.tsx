import { type FC, type ReactNode } from 'react'
import {
  NetworkIds,
  SDKNetwork,
  type SDKVaultType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { GenericTokenIcon } from '@/components/atoms/GenericTokenIcon/GenericTokenIcon'
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
  [SDKNetwork.Mainnet]: <Icon iconName="network_ethereum" size={16} />,
  [SDKNetwork.Base]: <Icon iconName="network_base" size={16} />,
  [SDKNetwork.ArbitrumOne]: <Icon iconName="network_arbitrum" size={16} />,
  [SDKNetwork.Optimism]: <Icon iconName="network_optimism" size={16} />,
}

interface VaultTitleProps {
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  value?: ReactNode
}

export const VaultTitle: FC<VaultTitleProps> = ({ symbol, value, networkId, networkName }) => {
  const isIconDefined = getTokenGuarded(symbol)?.iconName

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {isIconDefined ? (
          /* if any icon breaks, this is probably because of TokenSymbolsList vs whatever comes from the subgraph */
          <Icon tokenName={symbol as TokenSymbolsList} variant="xxl" />
        ) : (
          <GenericTokenIcon symbol={symbol} customSize={32} />
        )}
        {(networkId ?? networkName) && (
          <div
            style={{ position: 'absolute', top: '-3px', left: '-3px' }}
            data-testid="vault-network"
          >
            {networkId && networkIdIconMap[networkId]}
            {networkName && networkNameIconMap[networkName]}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text
          as="h4"
          variant="h4"
          style={{ color: 'white', fontSize: '24px', lineHeight: '30px' }}
          data-testid="vault-token"
        >
          {symbol}
        </Text>
        {value && <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>{value}</div>}
      </div>
    </div>
  )
}
