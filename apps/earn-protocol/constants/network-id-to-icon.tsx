import { Icon } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'

export const networkSDKChainIdIconMap = (
  chainId: SDKChainId.MAINNET | SDKChainId.BASE | SDKChainId.ARBITRUM | SDKChainId.OPTIMISM,
  size?: number,
) => {
  return {
    [SDKChainId.MAINNET]: <Icon iconName="earn_network_ethereum" size={size ?? 17} />,
    [SDKChainId.BASE]: <Icon iconName="earn_network_base" size={size ?? 17} />,
    [SDKChainId.ARBITRUM]: <Icon iconName="earn_network_arbitrum" size={size ?? 17} />,
    [SDKChainId.OPTIMISM]: <Icon iconName="earn_network_optimism" size={size ?? 17} />,
  }[chainId]
}
