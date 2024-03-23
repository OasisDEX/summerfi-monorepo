import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { IPool } from '@summerfi/sdk-common/protocols'
import { SwapProviderType } from '@summerfi/swap-common/enums'
import { testTargetLendingPoolRequiredSwaps } from './testSourcePosition'

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

function mockGetFee() {
  return Percentage.createFrom({ value: 0 })
}

/* eslint-disable @typescript-eslint/no-unused-vars */
async function mockGetPool(poolId: unknown): Promise<IPool> {
  return testTargetLendingPoolRequiredSwaps as IPool
}

export const mockRefinanceContext = {
  getSummerFee: mockGetFee,
  protocolManager: {
    getPool: mockGetPool,
    getPosition: () => {},
  },
  swapManager: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: jest.fn().mockImplementation(getSwapQuoteExactInput),
  },
}
