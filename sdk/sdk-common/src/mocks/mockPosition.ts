import type { Chain } from '~sdk-common/client/implementation/Chain'

import { TokenSymbol } from '~sdk-common/common/enums'
import type { Maybe } from '~sdk-common/common/aliases'
import { Percentage } from '~sdk-common/common/implementation/Percentage'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { PositionId } from '~sdk-common/common/implementation/PositionId'
import { RiskRatio } from '~sdk-common/common/implementation/RiskRatio'
import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'
import { PoolType } from '~sdk-common/protocols/interfaces/PoolType'
import { ProtocolName } from '~sdk-common/protocols/interfaces/ProtocolName'

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
      protocol: ProtocolName.Maker,
      type: PoolType.Lending,
    },
  }
}
