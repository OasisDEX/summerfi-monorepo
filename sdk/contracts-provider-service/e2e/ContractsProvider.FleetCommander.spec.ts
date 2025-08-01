import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IContractsProvider, IFleetCommanderContract } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common'
import { Tenderly, type Vnet } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils'
import { ContractsProviderFactory } from '../src/implementation/ContractsProviderFactory'
import type { ITokensManager } from '@summerfi/tokens-common'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import { ConfigurationProvider } from '@summerfi/configuration-provider'

describe.skip('Contracts Provider Service - FleetCommander Contract', () => {
  const configurationProvider = new ConfigurationProvider()
  const tenderly = new Tenderly()

  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const contractAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  let tenderlyFork: Vnet
  let contractsProvider: IContractsProvider
  let fleetCommanderContract: IFleetCommanderContract
  let blockchainClientProvider: IBlockchainClientProvider
  let tokensManager: ITokensManager

  const atBlock = 'latest'

  beforeEach(async () => {
    // Tenderly Fork
    tenderlyFork = await tenderly.createVnet({ chainInfo, atBlock })

    blockchainClientProvider = new BlockchainClientProviderMock({
      configProvider: configurationProvider,
      rpcUrl: tenderlyFork.getRpc(),
    })

    tokensManager = TokensManagerFactory.newTokensManager({
      configProvider: configurationProvider,
    })

    // Contracts Provider
    contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider: configurationProvider,
      blockchainClientProvider,
      tokensManager,
    })

    fleetCommanderContract = await contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: contractAddress,
    })

    expect(fleetCommanderContract).toBeDefined()
  })

  afterEach(() => {
    tenderlyFork.delete()
  })

  it('should have correct address and chain', async () => {
    expect(fleetCommanderContract.address).toEqual(contractAddress)
    expect(fleetCommanderContract.chainInfo).toEqual(chainInfo)
  })

  it('should retrieve arks', async () => {
    const arks = await fleetCommanderContract.arks()

    expect(arks).toBeDefined()
  })
})
