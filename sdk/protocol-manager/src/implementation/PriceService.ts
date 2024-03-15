import { IPriceService } from '../interfaces/ProtocolPlugin';
import { PublicClient, getContract } from 'viem';
import { Address, CurrencySymbol, Price, Token, TokenSymbol } from '@summerfi/sdk-common/common';
import { BigNumber } from 'bignumber.js';
import { priceFeedABI } from './priceFeedABI';

// TODO: implement for different chains, right now supports only Ethereum
export class PriceService implements IPriceService {
  private priceFeed = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf' as const;
  private abi = priceFeedABI;
  private currencySymbols: Record<CurrencySymbol, Address> = {
    [CurrencySymbol.USD]: Address.createFrom({ value: '0x0000000000000000000000000000000000000348' }),
  };

  constructor(private publicClient: PublicClient) { }

  private getContract() {
    return getContract({
      address: this.priceFeed,
      abi: this.abi,
      client: this.publicClient,
    });
  }

  async getPrice(args: { baseToken: Token; quoteToken: Token | CurrencySymbol; }): Promise<Price> {
    let quoteToken: `0x${string}`;
    if (args.quoteToken instanceof Token) {
      quoteToken = args.quoteToken.address.value;
    } else {
      quoteToken = this.currencySymbols[args.quoteToken].value;
    }

    let baseToken: `0x${string}`;
    if (args.baseToken.symbol === TokenSymbol.WETH) {
      baseToken = `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`;
    } else {
      baseToken = args.baseToken.address.value;
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
    });
  }

  async getPriceUSD(token: Token): Promise<Price> {
    return this.getPrice({ baseToken: token, quoteToken: CurrencySymbol.USD });
  }
}
