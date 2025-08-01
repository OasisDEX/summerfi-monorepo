import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import {
  IContractsProvider,
  IProtocolAccessManagerWhiteListContract,
} from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo } from '@summerfi/sdk-common'
import { Tenderly, type Vnet } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils'
import { ContractsProvider } from '../src/implementation/ContractsProvider'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import { ConfigurationProvider } from '@summerfi/configuration-provider'

describe('Contracts Provider Service - ProtocolAccessManagerWhiteList Contract', () => {
  const configurationProvider = new ConfigurationProvider()
  const tenderly = new Tenderly()

  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const contractAddress = Address.createFromEthereum({
    value: '0x2D2824B0f437e72B9c9194b798DecA125ccCFFeB', // Mock ProtocolAccessManagerWhiteList address on Base
  })

  let tenderlyVnet: Vnet
  let tenderlyVnetFork: Vnet
  let contractsProvider: IContractsProvider
  let protocolAccessManagerWhiteListContract: IProtocolAccessManagerWhiteListContract
  let blockchainClientProvider: IBlockchainClientProvider

  const atBlock = 'latest'

  beforeAll(async () => {
    tenderlyVnet = await tenderly.createVnet({ chainInfo, atBlock })
  })
  afterAll(async () => {
    await tenderlyVnet.delete()
  })

  beforeEach(async () => {
    // Tenderly Fork
    tenderlyVnetFork = await tenderlyVnet.fork()

    blockchainClientProvider = new BlockchainClientProviderMock({
      configProvider: configurationProvider,
      rpcUrl: tenderlyVnet.getRpc(),
    })

    const tokensManager = TokensManagerFactory.newTokensManager({
      configProvider: configurationProvider,
    })

    // Contracts Provider
    contractsProvider = new ContractsProvider({
      configProvider: configurationProvider,
      blockchainClientProvider,
      tokensManager,
    })

    protocolAccessManagerWhiteListContract =
      await contractsProvider.getProtocolAccessManagerWhiteListContract({
        chainInfo,
        address: contractAddress,
      })

    expect(protocolAccessManagerWhiteListContract).toBeDefined()
  })

  afterEach(async () => {
    await tenderlyVnetFork.delete() // Clean up the fork after each test
  })

  it('should have correct address and chain', async () => {
    expect(protocolAccessManagerWhiteListContract.address).toEqual(contractAddress)
    expect(protocolAccessManagerWhiteListContract.chainInfo).toEqual(chainInfo)
  })

  it('should have all expected interface methods', () => {
    // Test read methods
    expect(protocolAccessManagerWhiteListContract.hasRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.generateRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.guardianExpirations).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.GOVERNOR_ROLE).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.SUPER_KEEPER_ROLE).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.DECAY_CONTROLLER_ROLE).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.ADMIRALS_QUARTERS_ROLE).toBeDefined()

    // Test write methods
    expect(protocolAccessManagerWhiteListContract.grantGovernorRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeGovernorRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantSuperKeeperRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeSuperKeeperRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantWhitelistedRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeWhitelistedRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantCuratorRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeCuratorRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantKeeperRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeKeeperRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantCommanderRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeCommanderRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantDecayControllerRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeDecayControllerRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.grantAdmiralsQuartersRole).toBeDefined()
    expect(protocolAccessManagerWhiteListContract.revokeAdmiralsQuartersRole).toBeDefined()
  })

  it('should retrieve role constants', async () => {
    // Test that role constant methods return valid hash values
    const governorRole = await protocolAccessManagerWhiteListContract.GOVERNOR_ROLE()
    const superKeeperRole = await protocolAccessManagerWhiteListContract.SUPER_KEEPER_ROLE()
    const decayControllerRole = await protocolAccessManagerWhiteListContract.DECAY_CONTROLLER_ROLE()

    expect(governorRole).toBeDefined()
    expect(typeof governorRole).toBe('string')
    expect(governorRole.startsWith('0x')).toBe(true)
    expect(governorRole.length).toBe(66) // 32 bytes hex string

    expect(superKeeperRole).toBeDefined()
    expect(typeof superKeeperRole).toBe('string')
    expect(superKeeperRole.startsWith('0x')).toBe(true)
    expect(superKeeperRole.length).toBe(66)

    expect(decayControllerRole).toBeDefined()
    expect(typeof decayControllerRole).toBe('string')
    expect(decayControllerRole.startsWith('0x')).toBe(true)
    expect(decayControllerRole.length).toBe(66)
  })
})
