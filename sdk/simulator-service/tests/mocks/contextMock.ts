import {
  Address,
  ChainInfo,
  Price,
  Percentage,
  Token,
  TokenAmount,
  type AddressValue,
  CurrencySymbol,
} from '@summerfi/sdk-common/common'
import { SwapProviderType } from '@summerfi/sdk-common/swap'

async function getSwapDataExactInput(params: {
  chainInfo: ChainInfo
  fromAmount: TokenAmount
  toToken: Token
  recipient: Address
  slippage: Percentage
}) {
  return {
    provider: SwapProviderType.OneInch,
    fromTokenAmount: params.fromAmount,
    toTokenAmount: TokenAmount.createFrom({ token: params.toToken, amount: '10' }),
    calldata: '0x000' as const,
    targetContract: Address.ZeroAddressEthereum,
    value: '0',
    gasPrice: '0',
  }
}

async function getSwapQuoteExactInput(params: {
  chainInfo: ChainInfo
  fromAmount: TokenAmount
  toToken: Token
}) {
  return {
    provider: SwapProviderType.OneInch,
    fromTokenAmount: params.fromAmount,
    toTokenAmount: TokenAmount.createFrom({ token: params.toToken, amount: '10' }),
    estimatedGas: '0',
  }
}

async function getSpotPrices(params: { chainInfo: ChainInfo; tokens: Token[] }) {
  const MOCK_PRICE = 0.5
  const MOCK_QUOTE_CURRENCY = CurrencySymbol.USD
  return {
    provider: SwapProviderType.OneInch,
    prices: params.tokens
      .map((token) => [token.address.value, MOCK_PRICE])
      .map(([address, price]) => {
        const baseToken = params.tokens.find((token) =>
          token.address.equals(Address.createFrom({ value: address as AddressValue })),
        )
        if (!baseToken) {
          throw new Error('BaseToken not found in params.tokens list when fetching spot prices')
        }

        return Price.createFrom({
          value: price.toString(),
          baseToken,
          quoteToken: MOCK_QUOTE_CURRENCY,
        })
      }),
  }
}

export function mockGetFee() {
  return Percentage.createFrom({ percentage: 0 })
}

export const mockRefinanceContext = {
  getSummerFee: mockGetFee,
  swapManager: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: jest.fn().mockImplementation(getSwapQuoteExactInput),
    getSpotPrices: getSpotPrices,
  },
}
