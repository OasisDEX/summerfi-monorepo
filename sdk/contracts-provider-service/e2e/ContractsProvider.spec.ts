import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common'
import { ConfigurationProviderMock } from '@summerfi/configuration-provider-mock'
import { ContractsProviderFactory } from '../src'

describe('Contracts Provider Service - ERC20 Contract', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const erc20ContractAddress = Address.createFromEthereum({
    value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  })

  const erc4626ContractAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  const fleetCommanderContractAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  let contractsProvider: IContractsProvider

  beforeEach(() => {
    const configProvider = new ConfigurationProviderMock()

    const blockchainClientProvider = new BlockchainClientProvider({ configProvider })
    contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider,
      blockchainClientProvider,
    })
  })

  it('should return contract instances for all supported contracts', async () => {
    const erc20Contract = await contractsProvider.getErc20Contract({
      chainInfo,
      address: erc20ContractAddress,
    })
    expect(erc20Contract).toBeDefined()

    const erc4626Contract = await contractsProvider.getErc4626Contract({
      chainInfo,
      address: erc4626ContractAddress,
    })
    expect(erc4626Contract).toBeDefined()

    const fleetCommanderContract = await contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: fleetCommanderContractAddress,
    })
    expect(fleetCommanderContract).toBeDefined()
  })
})
