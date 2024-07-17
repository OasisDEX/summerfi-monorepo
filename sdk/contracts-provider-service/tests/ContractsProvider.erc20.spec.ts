import { IBlockchainClientProvider } from '@summerfi/blockchain-client-provider'
import { IContractsProvider, IErc20Contract } from '@summerfi/contracts-provider-common'
import { Address, ChainFamilyMap, ChainInfo, TokenAmount } from '@summerfi/sdk-common'
import { Tenderly, TenderlyFork } from '@summerfi/tenderly-utils'
import { BlockchainClientProviderMock } from '@summerfi/testing-utils/mocks/managers/BlockchainClientProviderMock'
import { ConfigurationProviderMock } from '@summerfi/testing-utils/mocks/managers/ConfigurationProviderMock'
import { ContractsProviderFactory } from '../src/implementation/ContractsProviderFactory'

describe('Contracts Provider Service - ERC20 Contract', () => {
  const configurationProvider = new ConfigurationProviderMock()
  const tenderly = new Tenderly({ configurationProvider })

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

  let tenderlyFork: TenderlyFork
  let contractsProvider: IContractsProvider
  let erc20Contract: IErc20Contract
  let blockchainClientProvider: IBlockchainClientProvider

  beforeEach(async () => {
    configurationProvider.setConfigurationItem({
      name: 'RPC_GATEWAY',
      value: 'https://rpc-gateway-url.com',
    })

    // Tenderly Fork
    tenderlyFork = await tenderly.createFork({ chainInfo, atBlock: 19475802 })

    blockchainClientProvider = new BlockchainClientProviderMock({
      configProvider: configurationProvider,
      rpcUrl: tenderlyFork.forkUrl,
    })

    // Contracts Provider
    contractsProvider = ContractsProviderFactory.newContractsProvider({
      configProvider: configurationProvider,
      blockchainClientProvider,
    })

    erc20Contract = await contractsProvider.getErc20Contract({
      chainInfo,
      address: contractAddress,
    })

    expect(erc20Contract).toBeDefined()
  })

  it('should retrieve information from the ERC20 contract', async () => {
    await tenderlyFork.setErc20Balance({
      amount: TokenAmount.createFrom({
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
    expect(userBalance.amount).toEqual('123000000')
    expect(userBalance.token).toEqual(token)

    const userAllowance = await erc20Contract.allowance({
      owner: userAddress,
      spender: spenderAddress,
    })
    expect(userAllowance).toBeDefined()
    expect(userAllowance.amount).toEqual('0')
    expect(userAllowance.token).toEqual(token)
  })

  it('should generate allowance transaction', async () => {
    const allowanceTransaction = await erc20Contract.approve({
      spender: spenderAddress,
      amount: TokenAmount.createFrom({
        token: await erc20Contract.getToken(),
        amount: '84000000', // 84 USDC
      }), //
    })

    expect(allowanceTransaction).toBeDefined()
    expect(allowanceTransaction.description).toEqual(
      `Approve ${spenderAddress} to spend 84000000 USDC of ${contractAddress}`,
    )
    expect(allowanceTransaction.transaction).toBeDefined()
    expect(allowanceTransaction.transaction.calldata).toBeDefined()
    expect(allowanceTransaction.transaction.target).toEqual(contractAddress)
    expect(allowanceTransaction.transaction.value).toEqual('0')
  })
})
