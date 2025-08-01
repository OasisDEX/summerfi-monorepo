import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IContractsProvider, IErc20Contract } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo, TokenAmount } from '@summerfi/sdk-common'
import { Tenderly, type Vnet } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils'
import { ContractsProviderFactory } from '../src/implementation/ContractsProviderFactory'
import { TokensManagerFactory } from '@summerfi/tokens-service'
import type { ITokensManager } from '@summerfi/tokens-common'
import { ConfigurationProvider } from '@summerfi/configuration-provider'

describe.skip('Contracts Provider Service - ERC20 Contract', () => {
  const configurationProvider = new ConfigurationProvider()
  const tenderly = new Tenderly()

  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const contractAddress = Address.createFromEthereum({
    value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  })

  const userAddress = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  })

  const spenderAddress = Address.createFromEthereum({
    value: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })

  let tenderlyFork: Vnet
  let contractsProvider: IContractsProvider
  let erc20Contract: IErc20Contract
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

    erc20Contract = await contractsProvider.getErc20Contract({
      chainInfo,
      address: contractAddress,
    })

    expect(erc20Contract).toBeDefined()
  })

  afterEach(() => {
    tenderlyFork.delete()
  })

  it('should retrieve information from the ERC20 contract', async () => {
    await tenderlyFork.setErc20Balance({
      amount: TokenAmount.createFromBaseUnit({
        token: await erc20Contract.getToken(),
        amount: '123000000', // 123 USDC
      }),
      walletAddress: userAddress,
    })

    expect(erc20Contract.address).toEqual(contractAddress)
    expect(erc20Contract.chainInfo).toEqual(chainInfo)

    const token = await erc20Contract.getToken()
    expect(token).toBeDefined()

    expect(token.address).toEqual(contractAddress)
    expect(token.chainInfo).toEqual(chainInfo)
    expect(token.name).toEqual('USD Coin')
    expect(token.symbol).toEqual('USDC')
    expect(token.decimals).toEqual(6)

    const userBalance = await erc20Contract.balanceOf({ address: userAddress })
    expect(userBalance).toBeDefined()
    expect(userBalance.toSolidityValue()).toEqual(123000000n)
    expect(userBalance.token).toEqual(token)

    const userAllowance = await erc20Contract.allowance({
      owner: userAddress,
      spender: spenderAddress,
    })
    expect(userAllowance).toBeDefined()
    expect(userAllowance.amount).toEqual('0')
    expect(userAllowance.token).toEqual(token)
  })

  it('should generate approve transaction', async () => {
    const approveTransaction = await erc20Contract.approve({
      spender: spenderAddress,
      amount: TokenAmount.createFromBaseUnit({
        token: await erc20Contract.getToken(),
        amount: '84000000', // 84 USDC
      }), //
    })

    expect(approveTransaction).toBeDefined()
    expect(approveTransaction.description).toEqual(
      `Approve ${spenderAddress} to spend 84 USDC of ${contractAddress}`,
    )
    expect(approveTransaction.transaction).toBeDefined()
    expect(approveTransaction.transaction.calldata).toBeDefined()
    expect(approveTransaction.transaction.target).toEqual(contractAddress)
    expect(approveTransaction.transaction.value).toEqual('0')
  })
})
