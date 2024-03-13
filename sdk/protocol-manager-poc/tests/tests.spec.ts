import {
  ProtocolPlugin,
  ProtocolManagerContext,
  ITokenService,
  IPriceService,
  createSparkPlugin
} from '../src/index'
import { createPublicClient, http, PublicClient, getContract } from 'viem'
import { mainnet } from 'viem/chains'
import { Address, ChainInfo, CurrencySymbol, Price, Token, TokenSymbol } from '@summerfi/sdk-common/common'
import { BigNumber } from 'bignumber.js'
import type { SparkPoolId, MakerPoolId } from "@summerfi/sdk-common/protocols"
import { ProtocolName, EmodeType, ILKType } from "@summerfi/sdk-common/protocols"
import { createMakerPlugin } from '../src/implementation/MakerPlugin'


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

    let baseToken: `0x${string}`
    if (args.baseToken.symbol === TokenSymbol.WETH) {
      baseToken = `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
    } else {
      baseToken = args.baseToken.address.value
    }

    let res: bigint;
    // Check if the quote token is neither USD nor ETH. This condition ensures we handle pairs involving other tokens.
    if (args.quoteToken !== CurrencySymbol.USD && args.quoteToken.symbol !== TokenSymbol.ETH) {
      // Example context: Consider handling a pool pair like WETH/DAI, where neither token is USD or ETH directly.

      // Retrieve the USD price of the quote token. Example: Obtaining DAI's price in USD.
      const priceOfQuoteInUSD = await this.getPriceUSD(args.quoteToken);

      // Retrieve the USD price of the base token (collateral). Example: Obtaining WETH's price in USD.
      const priceOfCollateralInUSD = await this.getPriceUSD(args.baseToken);

      // Calculate the ratio of base token to quote token in terms of their USD price. This effectively gives us the pair's price, such as WETH/DAI, by dividing the price of WETH in USD by the price of DAI in USD.
      // The result is converted to a BigInt to maintain precision without floating point errors.
      res = BigInt(new BigNumber(priceOfCollateralInUSD.value).dividedToIntegerBy(new BigNumber(priceOfQuoteInUSD.value)).toString());
    } else {
      // If the quote token is either USD or ETH, directly use the smart contract's latest price answer for the pair.
      // This path assumes that for these common base or quote tokens, a direct contract call is more efficient or accurate.
      res = await this.getContract().read.latestAnswer([baseToken, quoteToken]);
    }

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
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0x6B175474E89094C44Da98b954EedeAC495271d0F'}),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    }),
    'WETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'}),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    }),
    'SDAI': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0x83F20F44975D03b1b09e64809B757c47f942BEeA'}),
      symbol: 'SDAI',
      name: 'Savings DAI',
      decimals: 18,
    }),
    'USDC': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'}),
      symbol: 'USDC',
      name: 'Circle USD Stablecoin',
      decimals: 6,
    }),
    'WSTETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'}),
      symbol: 'WSTETH',
      name: 'Wrapped staked ETH',
      decimals: 18,
    }),
    'WBTC': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'}),
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8,
    }),
    'GNO': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0x6810e776880C02933D47DB1b9fc05908e5386b96'}),
      symbol: 'GNO',
      name: 'Gnosis Token',
      decimals: 18,
    }),
    'RETH': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0xae78736Cd615f374D3085123A210448E74Fc6393'}),
      symbol: 'RETH',
      name: 'Rocket ETH',
      decimals: 18,
    }),
    'USDT': Token.createFrom({
      chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      address: Address.createFrom({value: '0xdAC17F958D2ee523a2206206994597C13D831ec7'}),
      symbol: 'USDT',
      name: 'Tether USD Stablecoin',
      decimals: 6,
    }),
    }

  async getTokenByAddress(address: Address): Promise<Token> {
    const token = Object.values(this.tokens).find(token => token.address.equals(address))
    if (!token) {
      throw new Error(`Token not found for ${address}`)
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
  let makerPlugin: ProtocolPlugin<MakerPoolId>
  let sparkPlugin: ProtocolPlugin<SparkPoolId>
  beforeAll(async () => {
    ctx = await createProtocolManagerContext()
    makerPlugin = createMakerPlugin(ctx)
    sparkPlugin = createSparkPlugin(ctx)
  })

  it.only('template/maker', async () => {
    // const result = await makerPlugin.getPool(makerPlugin.getPoolId("ETH-A"))
    const result = await makerPlugin.getPool({
        protocol: {
          name: ProtocolName.Maker,
          chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
        },
        ilkType: ILKType.ETH_A
    })
    console.log(`
    MAKER POOL
    ----------------
    Protocol: ${result.protocol.name}
    Chain: ${result.protocol.chainInfo.name}
    IlkType: ${JSON.stringify(result.poolId)}
    ${result.baseCurrency.toString()}}
    ${JSON.stringify(result.collaterals,null,4)}
    
    
    `)
  })

  it('template/spark', async () => {
    // const result = await sparkPlugin.getPool(sparkPlugin.getPoolId("0"))
    const result = await sparkPlugin.getPool({
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' })
      },
      emodeType: EmodeType.None
    })
    // console.log(result)
  })
})
