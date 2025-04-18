import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IContractsProvider, IErc4626Contract } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { Tenderly, TenderlyFork } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils'
import { ConfigurationProviderMock } from '@summerfi/configuration-provider-mock'
import { ContractsProviderFactory } from '../src/implementation/ContractsProviderFactory'

describe('Contracts Provider Service - ERC4626 Contract', () => {
  const configurationProvider = new ConfigurationProviderMock()
  const tenderly = new Tenderly({ configurationProvider })

  const chainInfo: ChainInfo = ChainFamilyMap.Base.Base

  const contractAddress = Address.createFromEthereum({
    value: '0xa09E82322f351154a155f9e0f9e6ddbc8791C794', // FleetCommander on Base
  })

  const USDC = Token.createFrom({
    address: Address.createFromEthereum({
      value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    }),
    chainInfo,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
  })

  const receiverAddress = Address.createFromEthereum({
    value: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })

  let tenderlyFork: TenderlyFork
  let contractsProvider: IContractsProvider
  let erc4626Contract: IErc4626Contract
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

    erc4626Contract = await contractsProvider.getErc4626Contract({
      chainInfo,
      address: contractAddress,
    })

    expect(erc4626Contract).toBeDefined()
  })

  it('should have correct address and chain', async () => {
    expect(erc4626Contract.address).toEqual(contractAddress)
    expect(erc4626Contract.chainInfo).toEqual(chainInfo)
  })

  it('should retrieve asset', async () => {
    const asset = await erc4626Contract.asset()

    expect(asset).toBeDefined()

    expect(asset).toEqual(USDC)
  })

  it('should retrieve totalAssets', async () => {
    const asset = await erc4626Contract.asset()

    const totalAssets = await erc4626Contract.totalAssets()
    expect(totalAssets).toBeDefined()

    expect(totalAssets.token).toEqual(asset)
    expect(totalAssets.toSolidityValue()).toEqual(1000000n)
  })

  it('should convert to ERC20', async () => {
    const erc20Contract = erc4626Contract.asErc20()

    expect(erc20Contract).toBeDefined()
    expect(erc20Contract.address).toEqual(contractAddress)
    expect(erc20Contract.chainInfo).toEqual(chainInfo)
  })

  it('should generate deposit transaction', async () => {
    const amountToDeposit = TokenAmount.createFromBaseUnit({
      token: USDC,
      amount: '1000000',
    })

    const transactionInfo = await erc4626Contract.deposit({
      assets: amountToDeposit,
      receiver: receiverAddress,
    })

    expect(transactionInfo).toBeDefined()
    expect(transactionInfo.description).toEqual(
      `Deposit ${amountToDeposit} on vault ${contractAddress}`,
    )
    expect(transactionInfo.transaction).toBeDefined()
    expect(transactionInfo.transaction.calldata).toBeDefined()
    expect(transactionInfo.transaction.target).toEqual(contractAddress)
    expect(transactionInfo.transaction.value).toEqual('0')
  })
})
