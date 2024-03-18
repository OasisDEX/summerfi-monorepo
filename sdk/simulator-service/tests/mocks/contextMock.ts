import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { SwapProviderType } from '@summerfi/swap-common/enums'

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

export function mockGetFee() {
  return Percentage.createFrom({ percentage: 0 })
}

export const mockRefinanceContext = {
  getSummerFee: mockGetFee,
  swapManager: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: jest.fn().mockImplementation(getSwapQuoteExactInput),
  },
}
