import { createMakerPlugin, ProtocolPlugin, ProtocolManagerContext, ITokenService, IPriceService  } from '~src/index'
import { createPublicClient, http, PublicClient, getContract } from 'viem'
import { mainnet } from 'viem/chains'
import { Address, CurrencySymbol, Price, Token, TokenSymbol } from '@summerfi/sdk-common/common'
import { BigNumber } from 'bignumber.js'

import { priceFeedABI } from './priceFeedABI'

class PriceServiceMock implements IPriceService {
  private priceFeed = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf' as const
  private abi = priceFeedABI
  private currencySymbols: Record<CurrencySymbol, Address> = {
    [CurrencySymbol.USD]: Address.createFrom({value: '0x0000000000000000000000000000000000000348'}),
  }

  constructor(private publicClient: PublicClient) {}

  private getContract() {
    return getContract({
      address: this.priceFeed,
      abi: this.abi,
      client: this.publicClient,
    })
  }

  async getPrice(args: {  baseToken: Token, quoteToken: Token | CurrencySymbol}): Promise<Price> {
    let quoteToken: `0x${string}`
    if (args.quoteToken instanceof Token) {
      quoteToken = args.quoteToken.address.value
    } else {
      quoteToken = this.currencySymbols[args.quoteToken].value
    }
    const res = await this.getContract().read.latestAnswer([args.baseToken.address.value, quoteToken])

    return Price.createFrom({
      baseToken: args.baseToken,
      quoteToken: args.quoteToken,
      value: new BigNumber(res.toString()).div(new BigNumber(10).pow(8)).toString(),
    })
  }

  async getPriceUSD(token: Token): Promise<Price> {
    return this.getPrice({ baseToken: token, quoteToken: CurrencySymbol.USD })
  }
}

class TokenServiceMock implements ITokenService {
  private tokens: Record<string, Token> = {
    'DAI': Token.createFrom({
      chainInfo: { chainId: 1, name: 'Ethereum' },
      address: Address.createFrom({value: '0x6B175474E89094C44Da98b954EedeAC495271d0F'}),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    }),
    'WETH': Token.createFrom({
      chainInfo: mainnet,
      address: Address.createFrom({value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'}),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    }),
    }

  async getTokenByAddress(address: Address): Promise<Token> {
    const token = Object.values(this.tokens).find(token => token.address.equals(address))
    if (!token) {
      throw new Error('Token not found')
    }
    return token
  }
  async getTokenBySymbol(symbol: TokenSymbol): Promise<Token> {
    return this.tokens[symbol]
  }
}

async function createProtocolManagerContext (): Promise<ProtocolManagerContext> {
  const provider = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(),
  })

  return {
    provider,
    tokenService: new TokenServiceMock(),
    priceService: new PriceServiceMock(provider),
  }
}

describe('playground', () => {
  let ctx: ProtocolManagerContext
  let makerPlugin: ProtocolPlugin
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
    makerPlugin = createMakerPlugin(ctx)
  })

  it('template', async () => {
    const result = await makerPlugin.getPool(makerPlugin.getPoolId("ETH-A"))
    console.log(result)

    console.log('hello')
  })
})
