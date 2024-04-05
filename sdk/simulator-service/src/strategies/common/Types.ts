import { type ISwapManager } from '@summerfi/swap-common/interfaces'
import { type IProtocolManager } from '@summerfi/protocol-manager-common'

export interface IRefinanceDependencies {
  swapManager: ISwapManager
  protocolManager: IProtocolManager
}
