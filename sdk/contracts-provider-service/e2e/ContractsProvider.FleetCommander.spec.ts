import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IContractsProvider, IFleetCommanderContract } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo, Percentage } from '@summerfi/sdk-common'
import { Tenderly, TenderlyFork } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils'
import { ConfigurationProviderMock } from '@summerfi/configuration-provider-mock'
import { ContractsProviderFactory } from '../src/implementation/ContractsProviderFactory'

describe('Contracts Provider Service - FleetCommander Contract', () => {
  const configurationProvider = new ConfigurationProviderMock()
  const tenderly = new Tenderly({ configurationProvider })

  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const contractAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  const userAddress = Address.createFromEthereum({
    value: '0x4Eb7F19D6eFcACE59EaED70220da5002709f9B71',
  })

  let tenderlyFork: TenderlyFork
  let contractsProvider: IContractsProvider
  let fleetCommanderContract: IFleetCommanderContract
  let blockchainClientProvider: IBlockchainClientProvider

  beforeEach(async () => {
    // Tenderly Fork
    tenderlyFork = await tenderly.createFork({ chainInfo, atBlock: 17211722 })

    blockchainClientProvider = new BlockchainClientProviderMock({
      configProvider: configurationProvider,
      rpcUrl: tenderlyFork.forkUrl,
    })

    // Contracts Provider
    contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider: configurationProvider,
      blockchainClientProvider,
    })

    fleetCommanderContract = await contractsProvider.getFleetCommanderContract({
      chainInfo,
      address: contractAddress,
    })

    expect(fleetCommanderContract).toBeDefined()
  })

  it('should have correct address and chain', async () => {
    expect(fleetCommanderContract.address).toEqual(contractAddress)
    expect(fleetCommanderContract.chainInfo).toEqual(chainInfo)
  })

  it('should retrieve arks', async () => {
    const arks = await fleetCommanderContract.arks({ address: userAddress })

    expect(arks).toBeDefined()

    expect(arks.maxAllocation).toEqual(Percentage.createFrom({ value: 0 }))
  })
})
