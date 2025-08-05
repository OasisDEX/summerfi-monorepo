import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import {
  IContractsProvider,
  IProtocolAccessManagerWhiteListContract,
  ContractSpecificRoleName,
} from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo, type HexData } from '@summerfi/sdk-common'
import { Tenderly, type Vnet } from '@summerfi/tenderly-utils'
import {
  BlockchainClientProviderMock,
  createSendTransactionTool,
  type SendTransactionTool,
} from '@summerfi/testing-utils'
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

  const TEST_USER_ADDRESS = process.env.TEST_USER_ADDRESS
  const E2E_USER_ADDRESS = process.env.E2E_USER_ADDRESS
  const E2E_USER_PRIVATE_KEY = process.env.E2E_USER_PRIVATE_KEY
  if (!E2E_USER_ADDRESS || !TEST_USER_ADDRESS || !E2E_USER_PRIVATE_KEY) {
    throw new Error('Env not defined in .env')
  }
  const governorAddress = Address.createFromEthereum({
    value: E2E_USER_ADDRESS,
  })
  const testAddress = Address.createFromEthereum({
    value: TEST_USER_ADDRESS,
  })
  const signerPrivateKey = E2E_USER_PRIVATE_KEY as HexData

  let tenderlyVnet: Vnet
  let contractsProvider: IContractsProvider
  let protocolAccessManagerWhiteListContract: IProtocolAccessManagerWhiteListContract
  let blockchainClientProvider: IBlockchainClientProvider
  let rpcUrl: string

  let governorSendTxTool: SendTransactionTool

  const atBlock = 'latest'

  beforeAll(async () => {
    tenderlyVnet = await tenderly.createVnet({ chainInfo, atBlock })
    rpcUrl = tenderlyVnet.getRpc()
    governorSendTxTool = createSendTransactionTool({
      chainInfo,
      rpcUrl,
      signerPrivateKey,
    })
  })
  afterAll(async () => {
    await tenderlyVnet.delete()
  })

  beforeEach(async () => {
    blockchainClientProvider = new BlockchainClientProviderMock({
      configProvider: configurationProvider,
      rpcUrl,
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

  afterEach(async () => {})

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

  it('should check governor role', async () => {
    const isGovernor = await protocolAccessManagerWhiteListContract.hasRole({
      role: await protocolAccessManagerWhiteListContract.GOVERNOR_ROLE(),
      account: governorAddress,
    })
    expect(isGovernor).toBe(true)
  })

  it('should grant and revoke governor role on an test address', async () => {
    const governorRole = await protocolAccessManagerWhiteListContract.GOVERNOR_ROLE()
    const isGovernorBefore = await protocolAccessManagerWhiteListContract.hasRole({
      role: governorRole,
      account: testAddress,
    })
    expect(isGovernorBefore).toBe(false)
    const grantTxInfo = await protocolAccessManagerWhiteListContract.grantGovernorRole({
      account: testAddress,
    })
    expect(grantTxInfo).toBeDefined()

    const grantStatus = await governorSendTxTool(grantTxInfo)
    expect(grantStatus).toBe('success')

    const isGovernor = await protocolAccessManagerWhiteListContract.hasRole({
      role: governorRole,
      account: testAddress,
    })
    expect(isGovernor).toBe(true)

    const revokeTxInfo = await protocolAccessManagerWhiteListContract.revokeGovernorRole({
      account: testAddress,
    })
    expect(revokeTxInfo).toBeDefined()
    const revokeStatus = await governorSendTxTool(revokeTxInfo)
    expect(revokeStatus).toBe('success')

    const isRevoked = await protocolAccessManagerWhiteListContract.hasRole({
      role: governorRole,
      account: testAddress,
    })
    expect(isRevoked).toBe(false)
  })

  // test whitelisted role for address 0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17
  it('should check whitelisted role', async () => {
    const roleTargetContract = Address.createFromEthereum({
      value: '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17',
    })
    const whitelistedRole = await protocolAccessManagerWhiteListContract.generateRole({
      roleName: ContractSpecificRoleName.WHITELISTED_ROLE,
      roleTargetContract,
    })
    const isWhitelistedInitially = await protocolAccessManagerWhiteListContract.hasRole({
      role: whitelistedRole,
      account: testAddress,
    })
    expect(isWhitelistedInitially).toBe(false)

    // assign role
    const grantTxInfo = await protocolAccessManagerWhiteListContract.grantWhitelistedRole({
      fleetCommanderAddress: roleTargetContract,
      account: testAddress,
    })
    expect(grantTxInfo).toBeDefined()
    const grantStatus = await governorSendTxTool(grantTxInfo)
    expect(grantStatus).toBe('success')
    const isWhitelistedPostGrant = await protocolAccessManagerWhiteListContract.hasRole({
      role: whitelistedRole,
      account: testAddress,
    })
    expect(isWhitelistedPostGrant).toBe(true)

    // revoke role
    const revokeTxInfo = await protocolAccessManagerWhiteListContract.revokeWhitelistedRole({
      fleetCommanderAddress: roleTargetContract,
      account: testAddress,
    })
    expect(revokeTxInfo).toBeDefined()
    const revokeStatus = await governorSendTxTool(revokeTxInfo)
    expect(revokeStatus).toBe('success')
    const isWhitelistedPostRevocation = await protocolAccessManagerWhiteListContract.hasRole({
      role: whitelistedRole,
      account: testAddress,
    })
    expect(isWhitelistedPostRevocation).toBe(false)
  })
})
