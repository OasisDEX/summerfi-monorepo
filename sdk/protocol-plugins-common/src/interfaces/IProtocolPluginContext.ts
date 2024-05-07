import { PublicClient } from 'viem'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'

/**
 * @name IProtocolPluginContext
 * @description This is the context that will be passed to the protocol plugins to inject the different
 *              services that they might need
 */
export interface IProtocolPluginContext {
  /** The deployment index. TODO: replace it with a more proper access to deployments */
  deployments: DeploymentIndex
  /** The public client to interact with the blockchain */
  provider: PublicClient
  /** The tokens manager to retrieve token information */
  tokensManager: ITokensManager
  /** The oracle service to fetch prices */
  oracleManager: IOracleManager
  /** The swap manager to request swap quotes and calldata */
  swapManager: ISwapManager
}
