import {
  Percentage,
  RiskRatio,
  TokenAmount,
  TokenSymbol,
  type Maybe,
  type Position,
  type PositionId,
  type Wallet,
} from '@summerfi/sdk-common/common'
import { ILKType, MakerPoolId, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import type { Chain } from '../implementation/Chain'

export async function getMockPosition(params: {
  chain: Chain
  wallet: Wallet
  id: PositionId
}): Promise<Maybe<Position>> {
  const debtToken = await params.chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.DAI })
  const collateralToken = await params.chain.tokens.getTokenBySymbol({ symbol: TokenSymbol.WETH })

  if (!debtToken || !collateralToken) {
    return undefined
  }

  return {
    positionId: params.id,
    debtAmount: TokenAmount.createFrom({ token: debtToken, amount: '56.78' }),
    collateralAmount: TokenAmount.createFrom({
      token: collateralToken,
      amount: '105.98',
    }),
    riskRatio: RiskRatio.createFrom({
      ratio: Percentage.createFrom({ percentage: 20.3 }),
    }),
    pool: {
      poolId: {
        protocol: ProtocolName.Maker,
        ilkType: ILKType.ETH_A,
        vaultId: 'testvault',
      } as MakerPoolId,
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: params.chain.chainInfo,
      },
      type: PoolType.Lending,
    },
  }
}
