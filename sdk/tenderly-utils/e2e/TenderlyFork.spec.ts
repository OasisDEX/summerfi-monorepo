import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { Address, ChainFamilyMap, Token, TokenAmount } from '@summerfi/sdk-common'
import { Tenderly } from '../src/Tenderly'

describe('e2e', () => {
  const walletAddress = Address.createFromEthereum({
    value: '0x275f568287595D30E216b618da37897f4bbaB1B6',
  })

  const forksInfo = [
    {
      chainInfo: ChainFamilyMap.Ethereum.Mainnet,
      atBlock: 19475802,
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
      tokens: {
        DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        RETH: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
        WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        WSTETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
      },
    },
    {
      chainInfo: ChainFamilyMap.Optimism.Optimism,
      atBlock: 122801659,
      tokens: {
        DAI: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        OP: '0x4200000000000000000000000000000000000042',
        RETH: '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D',
        WBTC: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
        WSTETH: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
      },
    },
  ]

  it('should test fork creation and cleanup', async () => {
    const tenderly = new Tenderly({ configurationProvider: new ConfigurationProvider() })
    for (const forkInfo of forksInfo) {
      const tenderlyFork = await tenderly.createFork({
        chainInfo: forkInfo.chainInfo,
        atBlock: forkInfo.atBlock,
      })
      console.log('-------------------------------------')
      console.log('Fork created: ', `${tenderlyFork.forkUrl}`)

      await tenderlyFork.setETHBalance({
        amount: TokenAmount.createFrom({
          amount: '100',
          token: Token.createFrom({
            chainInfo: forkInfo.chainInfo,
            address: Address.createFromEthereum({
              value: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            }),
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          }),
        }),
        walletAddress,
      })

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
      }

      await tenderlyFork.dispose()
      console.log('Fork removed: ', `${tenderlyFork.forkUrl}`)
    }
  }, 30000)
})
