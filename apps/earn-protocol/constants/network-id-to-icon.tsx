import { Icon } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'

export const networkSDKChainIdIconMap = (chainId: SDKChainId, size?: number) => {
  return {
    [SDKChainId.MAINNET]: <Icon iconName="earn_network_ethereum" size={size ?? 17} />,
    [SDKChainId.BASE]: <Icon iconName="earn_network_base" size={size ?? 17} />,
    [SDKChainId.ARBITRUM]: <Icon iconName="earn_network_arbitrum" size={size ?? 17} />,
    [SDKChainId.OPTIMISM]: <Icon iconName="earn_network_optimism" size={size ?? 17} />,
    [SDKChainId.SONIC]: <Icon iconName="earn_network_sonic" size={size ?? 17} />,
    [SDKChainId.SEPOLIA]: <Icon iconName="not_supported_icon" size={size ?? 17} />,
  }[chainId]
}
