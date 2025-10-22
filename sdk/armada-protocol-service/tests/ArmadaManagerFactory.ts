import { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ArmadaManagerFactory } from '../src/common/implementation/ArmadaManagerFactory'
import type { IArmadaSubgraphManager } from '@summerfi/subgraph-manager-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IDeploymentProvider } from '../src'
import type { ISwapManager } from '@summerfi/swap-common'
import type { IOracleManager } from '@summerfi/oracle-common'
import type { ITokensManager } from '@summerfi/tokens-common'
import { ChainIds, getChainInfoByChainId } from '@summerfi/sdk-common'

describe('SDK Common | Armada | ArmadaManagerFactory', () => {
  const configProvider: IConfigurationProvider = {} as IConfigurationProvider
  const allowanceManager: IAllowanceManager = {} as IAllowanceManager
  const contractsProvider: IContractsProvider = {} as IContractsProvider
  const subgraphManager = {} as IArmadaSubgraphManager

  describe('#newArmadaManager()', () => {
    it('should instantiate with right data', () => {
      const armadaManager = ArmadaManagerFactory.newArmadaManager({
        configProvider,
        allowanceManager,
        contractsProvider,
        subgraphManager,
        blockchainClientProvider: {} as IBlockchainClientProvider,
        deploymentProvider: {} as IDeploymentProvider,
        swapManager: {} as ISwapManager,
        oracleManager: {} as IOracleManager,
        tokensManager: {} as ITokensManager,
        supportedChains: [getChainInfoByChainId(ChainIds.Base)],
      })

      expect(armadaManager).toBeDefined()
    })
  })
})
