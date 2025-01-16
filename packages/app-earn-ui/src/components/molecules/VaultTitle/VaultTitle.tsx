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

import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

const networkIdIconMap = {
  [NetworkIds.MAINNET]: <Icon iconName="earn_network_ethereum" size={16} />,
  [NetworkIds.BASEMAINNET]: <Icon iconName="earn_network_base" size={16} />,
  [NetworkIds.ARBITRUMMAINNET]: <Icon iconName="earn_network_arbitrum" size={16} />,
  [NetworkIds.OPTIMISMMAINNET]: <Icon iconName="earn_network_optimism" size={16} />,
}

const networkNameIconMap = {
  [SDKNetwork.Mainnet]: <Icon iconName="earn_network_ethereum" size={16} />,
  [SDKNetwork.Base]: <Icon iconName="earn_network_base" size={16} />,
  [SDKNetwork.ArbitrumOne]: <Icon iconName="earn_network_arbitrum" size={16} />,
  [SDKNetwork.Optimism]: <Icon iconName="earn_network_optimism" size={16} />,
}

interface VaultTitleProps {
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  value?: ReactNode
  selected?: boolean
  titleVariant?: TextVariants
}

export const VaultTitle: FC<VaultTitleProps> = ({
  symbol,
  value,
  networkId,
  networkName,
  selected,
  titleVariant = 'h4',
}) => {
  const isIconDefined = getTokenGuarded(symbol)?.iconName

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {isIconDefined ? (
          /* if any icon breaks, this is probably because of TokenSymbolsList vs whatever comes from the subgraph */
          <Icon tokenName={symbol as TokenSymbolsList} size={44} />
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}>
          <Text
            as="h4"
            variant={titleVariant}
            style={{ color: 'white', fontWeight: 600 }}
            data-testid="vault-token"
          >
            {symbol}
          </Text>
          {selected && (
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'var(--earn-protocol-primary-40)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon iconName="checkmark" size={12} />
            </div>
          )}
        </div>
        {value && <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>{value}</div>}
      </div>
    </div>
  )
}
