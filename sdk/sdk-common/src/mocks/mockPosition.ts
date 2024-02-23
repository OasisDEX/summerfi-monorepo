import type { Chain } from '~sdk-common/client'
import {
  Percentage,
  RiskRatio,
  TokenAmount,
  Wallet,
  type PositionId,
  type Position,
  TokenSymbol,
} from '~sdk-common/common'
import { PoolType } from '~sdk-common/protocols'
import { Maybe } from '~sdk-common/utils'

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
      poolId: { id: 'testpool' },
      protocolId: { id: 'testprotocol' },
      type: PoolType.Lending,
    },
  }
}
