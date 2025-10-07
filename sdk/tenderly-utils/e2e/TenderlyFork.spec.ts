import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { Address, AddressValue, ChainFamilyMap, Token, TokenAmount } from '@summerfi/sdk-common'
import { createPublicClient, erc20Abi, getContract, http } from 'viem'
import { arbitrum, mainnet } from 'viem/chains'
import { Tenderly } from '../src/Tenderly'

describe('e2e', () => {
  const configurationProvider = new ConfigurationProvider()

  const userAddress = configurationProvider.getConfigurationItem<AddressValue>({
    name: 'TEST_USER_ADDRESS',
  })

  if (!userAddress) {
    throw new Error('TEST_USER_ADDRESS not defined in .env')
  }

  const walletAddress = Address.createFromEthereum({
    value: userAddress,
  })

  const forksInfo = [
    {
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      atBlock: 19475802,
      chain: mainnet,
      tokens: {
        CBETH: '0xbe9895146f7af43049ca1c1ae358b0541ea49704',
        DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
        RETH: '0xae78736cd615f374d3085123a210448e74fc6393',
        SDAI: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
        WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        WSTETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      },
    },
    {
      chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
      atBlock: 233082201,
      chain: arbitrum,
      tokens: {
        DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        RETH: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
        WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        WSTETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
      },
    },
  ]

  it('should test fork creation and cleanup', async () => {
    const tenderly = new Tenderly({ configurationProvider: new ConfigurationProvider() })

    for (const forkInfo of forksInfo) {
      const tenderlyFork = await tenderly.createVnet({
        chainInfo: forkInfo.chainInfo,
        atBlock: forkInfo.atBlock,
      })

      expect(tenderlyFork).toBeDefined()
      expect(tenderlyFork.atBlock).toEqual(forkInfo.atBlock)
      expect(tenderlyFork.chainInfo).toEqual(forkInfo.chainInfo)
      expect(tenderlyFork.forkId).toBeDefined()
      expect(tenderlyFork.forkUrl).toBeDefined()

      console.log('-------------------------------------')
      console.log(`Fork created for chain ${forkInfo.chainInfo.name}: ${tenderlyFork.forkUrl}`)

      // Create public client to read from the fork
      const transport = http(tenderlyFork.forkUrl, {
        batch: true,
        fetchOptions: {
          method: 'POST',
        },
      })

      const publicClient = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: forkInfo.chain,
        transport,
      })

      const ethBalanceBefore = await tenderlyFork.getETHBalance({ walletAddress })

      await tenderlyFork.setETHBalance({
        amount: ethBalanceBefore + 10n,
        walletAddress,
      })

      const ethBalanceAfter = await tenderlyFork.getETHBalance({ walletAddress })

      expect(ethBalanceAfter).toEqual(ethBalanceBefore + 10n)

      for (const [token, address] of Object.entries(forkInfo.tokens)) {
        await tenderlyFork.setErc20Balance({
          amount: TokenAmount.createFrom({
            amount: '123.18',
            token: Token.createFrom({
              chainInfo: forkInfo.chainInfo,
              address: Address.createFromEthereum({ value: address }),
              decimals: 18,
              name: token,
              symbol: token,
            }),
          }),
          walletAddress,
        })

        const erc20Contract = getContract({
          abi: erc20Abi,
          address,
          client: publicClient,
        })

        const balance = await erc20Contract.read.balanceOf([walletAddress.value])

        expect(balance.toString()).toEqual('123180000000000000000')
      }

      await tenderlyFork.dispose()
      console.log('Fork removed: ', `${tenderlyFork.forkUrl}`)
    }
  }, 30000)
})
