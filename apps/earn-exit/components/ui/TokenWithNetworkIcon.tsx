import { type FC } from 'react'

import { Icon, type IconNamesList } from './Icon'
import { type SupportedNetworkIds, type TokenSymbolsList } from './types'

import classNames from './TokenWithNetworkIcon.module.css'

const networkIdIconNameMap: { [key in SupportedNetworkIds]: IconNamesList } = {
  1: 'earn_network_ethereum',
  8453: 'earn_network_base',
  42161: 'earn_network_arbitrum',
  146: 'earn_network_sonic',
  999: 'earn_network_hyperliquid',
}

const tokenIconSizeMap = {
  tiny: 20,
  small: 25,
  medium: 44,
  large: 64,
}

const networkIconSizeMap = {
  tiny: 9,
  small: 11,
  medium: 16,
  large: 24,
}

const networkIconOffsetMap = {
  tiny: { top: -8, left: -1 },
  small: { top: -10, left: -2 },
  medium: { top: -2, left: -2 },
  large: { top: 0, left: 0 },
}

interface TokenWithNetworkIconProps {
  tokenName: TokenSymbolsList
  chainId: SupportedNetworkIds
  variant?: 'tiny' | 'small' | 'medium' | 'large'
  overrideIconSize?: number
}

export const TokenWithNetworkIcon: FC<TokenWithNetworkIconProps> = ({
  tokenName,
  chainId,
  variant = 'medium',
  overrideIconSize,
}) => {
  const resolvedNetworkIcon = networkIdIconNameMap[chainId]
  const resolvedIconSize = overrideIconSize ?? tokenIconSizeMap[variant]

  return (
    <div className={classNames.iconWithNetworkWrapper}>
      <Icon tokenName={tokenName.toUpperCase()} size={resolvedIconSize} />
      <div className={classNames.networkIcon} style={networkIconOffsetMap[variant]}>
        <Icon iconName={resolvedNetworkIcon} size={networkIconSizeMap[variant]} />
      </div>
    </div>
  )
}
