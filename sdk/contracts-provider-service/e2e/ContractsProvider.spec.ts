import { BlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common'
import { ConfigurationProviderMock } from '@summerfi/testing-utils/mocks/managers/ConfigurationProviderMock'
import { ContractsProviderFactory } from '../src'

describe('Contracts Provider Service - ERC20 Contract', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const contractAddress = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  })

  let contractsProvider: IContractsProvider

  beforeEach(() => {
    const configProvider = new ConfigurationProviderMock()
    configProvider.setConfigurationItem({
      name: 'RPC_GATEWAY',
      value: 'https://rpc-gateway-url.com',
    })

    const blockchainClientProvider = new BlockchainClientProvider({ configProvider })
    contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider,
      blockchainClientProvider,
    })
  })

  it('should return contract instances for all supported contracts', async () => {
    const erc20Contract = await contractsProvider.getErc20Contract({
      chainInfo,
      address: contractAddress,
    })
    expect(erc20Contract).toBeDefined()

    const erc4626Contract = await contractsProvider.getErc4626Contract({
      chainInfo,
      address: contractAddress,
    })
    expect(erc4626Contract).toBeDefined()

    const fleetCommanderContract = await contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: contractAddress,
    })
    expect(fleetCommanderContract).toBeDefined()
  })
})
