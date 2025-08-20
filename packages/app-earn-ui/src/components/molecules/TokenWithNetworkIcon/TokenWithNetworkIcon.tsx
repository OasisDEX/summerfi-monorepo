import { type FC } from 'react'
import {
  type IconNamesList,
  type SupportedNetworkIds,
  type SupportedSDKNetworks,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { networkIdIconNameMap, networkNameIconNameMap } from '@/constants/icon-maps'

import classNames from './TokenWithNetworkIcon.module.css'

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

type BaseProps = {
  tokenName: TokenSymbolsList
  variant?: 'tiny' | 'small' | 'medium' | 'large'
  overrideIconSize?: number
}

type TokenWithNetworkIconProps = BaseProps &
  (
    | {
        network: SupportedSDKNetworks
      }
    | {
        chainId: SupportedNetworkIds
      }
  )

export const TokenWithNetworkIcon: FC<TokenWithNetworkIconProps> = ({
  tokenName,
  variant = 'medium',
  overrideIconSize,
  ...rest
}) => {
  const resolvedNetworkIcon = (
    'network' in rest ? networkNameIconNameMap[rest.network] : networkIdIconNameMap[rest.chainId]
  ) as IconNamesList

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
