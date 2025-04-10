import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'

import { ArmadaManager } from './ArmadaManager'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name ArmadaManagerFactory
 * @description This class is responsible for creating instances of the ArmadaManager
 */
export class ArmadaManagerFactory {
  public static newArmadaManager(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
    subgraphManager: IArmadaSubgraphManager
    blockchainClientProvider: IBlockchainClientProvider
    swapManager: ISwapManager
    oracleManager: IOracleManager
    tokensManager: ITokensManager
  }): ArmadaManager {
    return new ArmadaManager(params)
  }
}
