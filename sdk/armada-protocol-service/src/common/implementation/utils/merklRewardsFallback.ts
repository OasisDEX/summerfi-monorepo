import { ChainIds, type ChainId, type IToken } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

const createNormalizeRewardAmount =
  (decimals: number) =>
  (amount: string): string =>
    BigNumber(amount).shiftedBy(decimals).toFixed()

// Static fallback data for Merkl rewards emissions by fleet address (lowercase)
// and token, with daily emission amount in token units (not decimals)
// Updated manually when needed, fleet addresses in lowercase
export const getMerklRewardsByFleetAddressFallback = (
  chainId: ChainId,
  getTokenBySymbol: (chainId: ChainId, symbol: string) => IToken,
): {
  [fleetAddress: string]: {
    token: IToken
    dailyEmission: string
  }[]
} => {
  let dataForChain: {
    [fleetAddress: string]: {
      token: IToken
      dailyEmission: string
    }[]
  }

  const getRewardDataForToken = (
    chainId: ChainId,
    tokenSymbol: string,
    merklDailyEmissionAmount: string,
    endTimestamp?: number,
  ) => {
    const token = getTokenBySymbol(chainId, tokenSymbol)
    if (!token) {
      throw new Error(`Token not found: ${tokenSymbol}`)
    }

    const expired = endTimestamp ? Date.now() / 1000 > endTimestamp : false

    return {
      token,
      dailyEmission: expired
        ? '0'
        : createNormalizeRewardAmount(token.decimals)(merklDailyEmissionAmount),
    }
  }

  switch (chainId) {
    case ChainIds.Base:
      dataForChain = {
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          getRewardDataForToken(chainId, 'SUMR', '13636'),
        ],
        // eurc low risk
        '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0': [
          getRewardDataForToken(chainId, 'SUMR', '5820'),
        ],
        // eth low risk
        '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af': [
          getRewardDataForToken(chainId, 'SUMR', '5820'),
        ],
      }
      break

    case ChainIds.ArbitrumOne:
      dataForChain = {
        // usdc low risk
        '0x71d77c39db0eb5d086611a2e950198e3077cf58a': [getRewardDataForToken(chainId, 'SUMR', '0')],
        // usdt low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [getRewardDataForToken(chainId, 'SUMR', '0')],
        // usdc low risk (hacked, old)
        '0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58': [getRewardDataForToken(chainId, 'SUMR', '0')],
      }
      break

    case ChainIds.Mainnet:
      dataForChain = {
        // eth low risk
        '0x67e536797570b3d8919df052484273815a0ab506': [
          getRewardDataForToken(chainId, 'SUMR', '45545'),
        ],
        // eth high risk
        '0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10': [
          getRewardDataForToken(chainId, 'SUMR', '84799'),
        ],
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          getRewardDataForToken(chainId, 'SUMR', '86935'),
        ],
        // usdc high risk
        '0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06': [
          getRewardDataForToken(chainId, 'SUMR', '5820'),
        ],
        // usdt low risk
        '0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d': [getRewardDataForToken(chainId, 'SUMR', '0')],
        // usdc (DAO)
        '0xd77f9a9f2b0c160db3e9dc2cce370c1a740c76fc': [
          getRewardDataForToken(chainId, 'SUMR', '5820'),
        ],
        // eth (DAO)
        '0x0c1fbccc019320032d9acd193447560c8c632114': [
          getRewardDataForToken(chainId, 'SUMR', '5820'),
          getRewardDataForToken(chainId, 'WSTETH', '0.0776', 1777557600),
        ],
      }
      break

    case ChainIds.Sonic:
      dataForChain = {
        // usdc.e low risk
        '0x507a2d9e87dbd3076e65992049c41270b47964f8': [getRewardDataForToken(chainId, 'SUMR', '0')],
      }
      break

    case ChainIds.Hyperliquid:
      dataForChain = {
        // usdc
        '0x252e5aa42c1804b85b2ce6712cd418a0561232ba': [getRewardDataForToken(chainId, 'SUMR', '0')],
        // usdt
        '0x2cc190fb654141dfbeac4c0f718f4d511674d346': [getRewardDataForToken(chainId, 'SUMR', '0')],
      }
      break

    default:
      throw new Error(`No Merkl rewards fallback data for chainId: ${chainId}`)
  }

  // make sure fleet addresses are lowercase (should be, but just in case)
  dataForChain = Object.fromEntries(
    Object.entries(dataForChain).map(([fleetAddress, rewards]) => [
      fleetAddress.toLowerCase(),
      rewards,
    ]),
  )

  return dataForChain
}
