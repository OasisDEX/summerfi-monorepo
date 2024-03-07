import { Chain } from '../client/implementation/Chain'
import { Maybe } from '../common/aliases/Maybe'
import { TokenSymbol } from '../common/enums/TokenSymbol'
import { Percentage } from '../common/implementation/Percentage'
import { Position } from '../common/implementation/Position'
import { PositionId } from '../common/implementation/PositionId'
import { RiskRatio } from '../common/implementation/RiskRatio'
import { TokenAmount } from '../common/implementation/TokenAmount'
import { Wallet } from '../common/implementation/Wallet'
import { ProtocolName } from '../protocols/enums/ProtocolName'
import { PoolType } from '../protocols/interfaces/PoolType'

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
      type: RiskRatio.type.LTV,
    }),
    pool: {
      poolId: { id: 'testpool' },
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: params.chain.chainInfo,
      },
      type: PoolType.Lending,
    },
  }
}
