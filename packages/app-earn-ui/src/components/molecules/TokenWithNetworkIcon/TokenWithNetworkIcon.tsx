import { type FC } from 'react'
import { SDKChainId, SDKNetwork, type TokenSymbolsList } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'

import classNames from './TokenWithNetworkIcon.module.scss'

export const chainIdIconMap = {
  [SDKChainId.MAINNET]: 'earn_network_ethereum',
  [SDKChainId.BASE]: 'earn_network_base',
  [SDKChainId.ARBITRUM]: 'earn_network_arbitrum',
  [SDKChainId.OPTIMISM]: 'earn_network_optimism',
}

export const networkNameIconMap = {
  [SDKNetwork.Mainnet]: 'earn_network_ethereum',
  [SDKNetwork.Base]: 'earn_network_base',
  [SDKNetwork.ArbitrumOne]: 'earn_network_arbitrum',
  [SDKNetwork.Optimism]: 'earn_network_optimism',
}

const tokenIconSizeMap = {
  small: 25,
  medium: 44,
  large: 64,
}

const networkIconSizeMap = {
  small: 11,
  medium: 16,
  large: 24,
}

const networkIconOffsetMap = {
  small: { top: -10, left: -2 },
  medium: { top: -2, left: -2 },
  large: { top: 0, left: 0 },
}

type BaseProps = {
  tokenName: TokenSymbolsList
  variant?: 'small' | 'medium' | 'large'
  overrideIconSize?: number
}

type TokenWithNetworkIconProps = BaseProps &
  (
    | {
        network: SDKNetwork
      }
    | {
        chainId: SDKChainId
      }
  )

export const TokenWithNetworkIcon: FC<TokenWithNetworkIconProps> = ({
  tokenName,
  variant = 'medium',
  overrideIconSize,
  ...rest
}) => {
  const resolvedNetworkIcon =
    'network' in rest ? networkNameIconMap[rest.network] : chainIdIconMap[rest.chainId]

  const resolvedIconSize = overrideIconSize ?? tokenIconSizeMap[variant]

  return (
    <div className={classNames.iconWithNetworkWrapper}>
      <Icon tokenName={tokenName.toUpperCase() as TokenSymbolsList} size={resolvedIconSize} />
      <div className={classNames.networkIcon} style={networkIconOffsetMap[variant]}>
        <Icon iconName={resolvedNetworkIcon} size={networkIconSizeMap[variant]} />
      </div>
    </div>
  )
}
