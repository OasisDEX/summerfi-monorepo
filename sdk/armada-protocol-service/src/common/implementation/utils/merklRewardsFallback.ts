import { ChainIds, type ChainId, type IToken } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

const createNormalizeRewardAmount =
  (decimals: number) =>
  (amount: string): string =>
    BigNumber(amount).shiftedBy(decimals).toFixed()

// Just a static fallback data for Merkl rewards emissions by fleet address
// Use as fallback while Merkl is failing to provide data via their API
// Updated manually when needed, fleet addresses in lowercase
export const getByFleetAddressFallback = (
  chainId: ChainId,
  token: IToken,
): {
  [fleetAddress: string]: {
    token: IToken
    dailyEmission: string
  }[]
} => {
  const normalizeRewardAmount = createNormalizeRewardAmount(token.decimals)

  switch (chainId) {
    case ChainIds.Base:
      return {
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: normalizeRewardAmount('9898') },
        ],
        // eurc low risk
        '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0': [
          { token, dailyEmission: normalizeRewardAmount('3192') },
        ],
        // eth low risk
        '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af': [
          { token, dailyEmission: normalizeRewardAmount('24284') },
        ],
      }
    case ChainIds.ArbitrumOne:
      return {
        // usdc low risk
        '0x71d77c39db0eb5d086611a2e950198e3077cf58a': [
          { token, dailyEmission: normalizeRewardAmount('16221') },
        ],
        // usdt low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: normalizeRewardAmount('2850') },
        ],
        // usdc low risk (hacked, old)
        '0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58': [
          { token, dailyEmission: normalizeRewardAmount('0') },
        ],
      }
    case ChainIds.Mainnet:
      return {
        // eth low risk
        '0x67e536797570b3d8919df052484273815a0ab506': [
          { token, dailyEmission: normalizeRewardAmount('78226') },
        ],
        // eth high risk
        '0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10': [
          { token, dailyEmission: normalizeRewardAmount('47957') },
        ],
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: normalizeRewardAmount('42163') },
        ],
        // usdc high risk
        '0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06': [
          { token, dailyEmission: normalizeRewardAmount('17054') },
        ],
        // usdt low risk
        '0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d': [
          { token, dailyEmission: normalizeRewardAmount('3717') },
        ],
        // usdc (DAO)
        '0xd77f9a9f2b0c160db3e9dc2cce370c1a740c76fc': [
          { token, dailyEmission: normalizeRewardAmount('4900') },
        ],
        // eth (DAO)
        '0x0c1fbccc019320032d9acd193447560c8c632114': [
          { token, dailyEmission: normalizeRewardAmount('4900') },
        ],
      }
    case ChainIds.Sonic:
      return {
        // usdc.e low risk
        '0x507a2d9e87dbd3076e65992049c41270b47964f8': [
          { token, dailyEmission: normalizeRewardAmount('4198') },
        ],
      }

    case ChainIds.Hyperliquid:
      return {
        // usdc
        '0x252e5aa42c1804b85b2ce6712cd418a0561232ba': [
          { token, dailyEmission: normalizeRewardAmount('8826') },
        ],
        // usdt
        '0x2cc190fb654141dfbeac4c0f718f4d511674d346': [
          { token, dailyEmission: normalizeRewardAmount('8826') },
        ],
      }

    default:
      throw new Error(`No Merkl rewards fallback data for chainId: ${chainId}`)
  }
}
