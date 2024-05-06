import { PublicClient, getContract } from 'viem'
import { Address, Price, Token } from '@summerfi/sdk-common/common'
import { BigNumber } from 'bignumber.js'
import { IPriceService, priceFeedABI } from '@summerfi/protocol-plugins-common'
import {
  CommonTokenSymbols,
  Denomination,
  FiatCurrency,
  IPrice,
  IToken,
  isToken,
} from '@summerfi/sdk-common'

// TODO: Create a separate service and connect up to SDK router
// TODO: Implement the PriceService to handle different chains
export class PriceService implements IPriceService {
  private priceFeed = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf' as const
  private abi = priceFeedABI
  private currencySymbols: Record<FiatCurrency, Address> = {
    [FiatCurrency.USD]: Address.createFromEthereum({
      value: '0x0000000000000000000000000000000000000348',
    }),
  }

  constructor(private publicClient: PublicClient) {}

  private getContract() {
    return getContract({
      address: this.priceFeed,
      abi: this.abi,
      client: this.publicClient,
    })
  }

  async getPrice(params: { base: IToken; quote: Denomination }): Promise<IPrice> {
    let quoteToken: `0x${string}`
    if (isToken(params.quote)) {
      quoteToken = params.quote.address.value
    } else {
      quoteToken = this.currencySymbols[params.quote].value
    }

    let baseToken: `0x${string}`
    if (params.base.symbol === CommonTokenSymbols.WETH) {
      baseToken = `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
    } else if (params.base.symbol === CommonTokenSymbols.WBTC) {
      baseToken = `0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB`
    } else {
      baseToken = params.base.address.value
    }

    let res: bigint
    // Check if the quote token is neither USD nor ETH. This condition ensures we handle pairs involving other tokens.
    if (params.quote !== FiatCurrency.USD && params.quote.symbol !== CommonTokenSymbols.ETH) {
      // Example context: Consider handling a pool pair like WETH/DAI, where neither token is USD or ETH directly.
      // Retrieve the USD price of the quote token. Example: Obtaining DAI's price in USD.
      const priceOfQuoteInUSD = await this.getPriceUSD(params.quote)

      // Retrieve the USD price of the base token (collateral). Example: Obtaining WETH's price in USD.
      const priceOfCollateralInUSD = await this.getPriceUSD(params.base)

      // Calculate the ratio of base token to quote token in terms of their USD price. This effectively gives us the pair's price, such as WETH/DAI, by dividing the price of WETH in USD by the price of DAI in USD.
      // The result is converted to a BigInt to maintain precision without floating point errors.
      res = BigInt(
        new BigNumber(priceOfCollateralInUSD.value)
          .dividedToIntegerBy(new BigNumber(priceOfQuoteInUSD.value))
          .toString(),
      )
    } else {
      // If the quote token is either USD or ETH, directly use the smart contract's latest price answer for the pair.
      // This path assumes that for these common base or quote tokens, a direct contract call is more efficient or accurate.
      res = await this.getContract().read.latestAnswer([baseToken, quoteToken])
    }

    return Price.createFrom({
      base: params.base,
      quote: params.quote,
      value: new BigNumber(res.toString()).div(new BigNumber(10).pow(8)).toString(),
    })
  }

  async getPriceUSD(token: Token): Promise<IPrice> {
    return this.getPrice({ base: token, quote: FiatCurrency.USD })
  }
}
