import { ChainIds, type ChainId, type IToken } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

export const getByFleetAddressFallback = (
  chainId: ChainId,
  token: IToken,
): {
  [fleetAddress: string]: {
    token: IToken
    dailyEmission: string
  }[]
} => {
  switch (chainId) {
    case ChainIds.Mainnet:
      return {
        // usdc high risk
        '0xe9cda459bed6dcfb8ac61cd8ce08e2d52370cb06': [
          { token, dailyEmission: BigNumber('26682').shiftedBy(token.decimals).toFixed() },
        ],
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: BigNumber('60142').shiftedBy(token.decimals).toFixed() },
        ],
        // usdt low risk
        '0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d': [
          { token, dailyEmission: BigNumber('18992').shiftedBy(token.decimals).toFixed() },
        ],
        // eth high risk
        '0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10': [
          { token, dailyEmission: BigNumber('37603').shiftedBy(token.decimals).toFixed() },
        ],
        // eth low risk
        '0x67e536797570b3d8919df052484273815a0ab506': [
          { token, dailyEmission: BigNumber('97837').shiftedBy(token.decimals).toFixed() },
        ],
      }
    case ChainIds.Base:
      return {
        // usdc low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: BigNumber('14886').shiftedBy(token.decimals).toFixed() },
        ],
        // eurc low risk
        '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0': [
          { token, dailyEmission: BigNumber('5753').shiftedBy(token.decimals).toFixed() },
        ],
        // eth low risk
        '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af': [
          { token, dailyEmission: BigNumber('33537').shiftedBy(token.decimals).toFixed() },
        ],
      }
    case ChainIds.Sonic:
      return {
        // usdc low risk
        '0x507a2d9e87dbd3076e65992049c41270b47964f8': [
          { token, dailyEmission: BigNumber('12461').shiftedBy(token.decimals).toFixed() },
        ],
      }
    case ChainIds.ArbitrumOne:
      return {
        // usdc low risk
        '0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58': [
          { token, dailyEmission: BigNumber('6772').shiftedBy(token.decimals).toFixed() },
        ],
        // usdt low risk
        '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17': [
          { token, dailyEmission: BigNumber('8677').shiftedBy(token.decimals).toFixed() },
        ],
      }

    default:
      throw new Error(`No Merkl rewards fallback data for chainId: ${chainId}`)
  }
}
