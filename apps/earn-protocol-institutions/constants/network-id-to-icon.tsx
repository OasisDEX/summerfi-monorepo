import { Icon, networkIdIconNameMap } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'

export const networkSDKChainIdIconMap = (chainId: SupportedNetworkIds, size?: number) => {
  const iconName = networkIdIconNameMap[chainId]

  return <Icon iconName={iconName} size={size ?? 17} />
}
