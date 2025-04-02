import {
  Denomination,
  FiatCurrency,
  ILendingPoolInfo,
  IToken,
  OracleProviderType,
  SpotPriceInfo,
} from '@summerfi/sdk-common'
import { Address, Maybe, Percentage, Price, Token, TokenAmount } from '@summerfi/sdk-common/common'
import {
  ILendingPool,
  ILendingPosition,
  ILendingPositionIdData,
} from '@summerfi/sdk-common/lending-protocols'
import {
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
} from '@summerfi/sdk-common/orders'
import { SwapProviderType } from '@summerfi/sdk-common/swap'
import { IUser } from '@summerfi/sdk-common/user'
import {
  testTargetLendingPool,
  testTargetLendingPoolInfo,
  testTargetLendingPoolRequiredSwaps,
} from './testSourcePosition'

async function getSwapDataExactInput(params: {
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

async function getSwapQuoteExactInput(params: { fromAmount: TokenAmount; toToken: Token }) {
  return {
    provider: SwapProviderType.OneInch,
    fromTokenAmount: params.fromAmount,
    toTokenAmount: TokenAmount.createFrom({ token: params.toToken, amount: '10' }),
    estimatedGas: '0',
  }
}

async function getSpotPrice(params: {
  baseToken: IToken
  denomination?: Denomination
}): Promise<SpotPriceInfo> {
  const MOCK_PRICE = 0.5
  const MOCK_QUOTE_CURRENCY = FiatCurrency.USD
  return {
    provider: OracleProviderType.OneInch,
    token: params.baseToken,
    price: Price.createFrom({
      value: MOCK_PRICE.toString(),
      base: params.baseToken,
      quote: params.denomination || MOCK_QUOTE_CURRENCY,
    }),
  }
}

export function mockGetFee() {
  return Percentage.createFrom({ value: 0 })
}

/* eslint-disable @typescript-eslint/no-unused-vars */
async function mockGetLendingPool(poolId: unknown): Promise<ILendingPool> {
  return testTargetLendingPool as ILendingPool
}

/* eslint-disable @typescript-eslint/no-unused-vars */
async function mockGetLendingPoolInfo(poolId: unknown): Promise<ILendingPoolInfo> {
  return testTargetLendingPoolInfo as ILendingPoolInfo
}

async function mockGetLendingPoolRequiresSwaps(poolId: unknown): Promise<ILendingPool> {
  return testTargetLendingPoolRequiredSwaps as ILendingPool
}

async function mockGetPosition(params: ILendingPositionIdData): Promise<ILendingPosition> {
  return {} as ILendingPosition
}

async function mockGetImportPositionTransaction(params: {
  user: IUser
  externalPosition: IExternalLendingPosition
  positionsManager: IPositionsManager
}): Promise<Maybe<TransactionInfo>> {
  return {} as Maybe<TransactionInfo>
}

export const mockRefinanceContext = {
  getSummerFee: mockGetFee,
  protocolManager: {
    getLendingPool: mockGetLendingPool,
    getLendingPoolInfo: mockGetLendingPoolInfo,
    getPosition: mockGetPosition,
    getImportPositionTransaction: mockGetImportPositionTransaction,
  },
  swapManager: {
    getSwapDataExactInput,
    getSwapQuoteExactInput: jest.fn().mockImplementation(getSwapQuoteExactInput),
    getSummerFee: jest.fn().mockImplementation(mockGetFee),
  },
  oracleManager: {
    getSpotPrice,
    getSpotPrices: jest.fn(),
  },
}

export const mockRefinanceContextRequiredSwaps = {
  ...mockRefinanceContext,
  protocolManager: {
    getLendingPool: mockGetLendingPoolRequiresSwaps,
    getLendingPoolInfo: mockGetLendingPoolInfo,
    getLendingPosition: mockGetPosition,
    getImportPositionTransaction: mockGetImportPositionTransaction,
  },
}
