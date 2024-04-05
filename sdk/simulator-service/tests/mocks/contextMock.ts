import {
  Address,
  ChainInfo,
  Percentage,
  Token,
  TokenAmount,
  Price,
  CurrencySymbol,
} from '@summerfi/sdk-common/common'
import { IPool } from '@summerfi/sdk-common/protocols'
import { testTargetLendingPool, testTargetLendingPoolRequiredSwaps } from './testSourcePosition'
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

async function getSpotPrice(params: {
  chainInfo: ChainInfo
  baseToken: Token
  quoteToken: Token | CurrencySymbol
}) {
  const MOCK_PRICE = 0.5
  const MOCK_QUOTE_CURRENCY = CurrencySymbol.USD
  return {
    provider: SwapProviderType.OneInch,
    price: Price.createFrom({
      value: MOCK_PRICE.toString(),
      baseToken: params.baseToken,
      quoteToken: MOCK_QUOTE_CURRENCY,
    }),
  }
}

export function mockGetFee() {
  return Percentage.createFrom({ value: 0 })
}

/* eslint-disable @typescript-eslint/no-unused-vars */
async function mockGetPool(poolId: unknown): Promise<IPool> {
  return testTargetLendingPool as IPool
}

async function mockGetPoolRequiresSwaps(poolId: unknown): Promise<IPool> {
  return testTargetLendingPoolRequiredSwaps as IPool
}

export const mockRefinanceContext = {
  getSummerFee: mockGetFee,
  protocolManager: {
    getPool: mockGetPool,
    getPosition: () => {},
  },
  swapManager: {
    getSwapDataExactInput,
    getSwapQuoteExactInput: jest.fn().mockImplementation(getSwapQuoteExactInput),
    getSpotPrice,
    getSummerFee: jest.fn().mockImplementation(mockGetFee),
  },
}

export const mockRefinanceContextRequiredSwaps = {
  ...mockRefinanceContext,
  protocolManager: {
    getPool: mockGetPoolRequiresSwaps,
    getPosition: () => {},
  },
}
