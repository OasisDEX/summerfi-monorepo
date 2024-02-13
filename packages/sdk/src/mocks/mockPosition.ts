import { Chain } from '~sdk/chains'
import { Percentage, RiskRatio, TokenAmount, Wallet } from '~sdk/common'
import { PoolType } from '~sdk/protocols'
import { Position, PositionId } from '~sdk/users'
import { Maybe } from '~sdk/utils'

export async function getMockPosition(params: {
  chain: Chain
  wallet: Wallet
  id: PositionId
}): Promise<Maybe<Position>> {
  const debtToken = await params.chain.tokens.getTokenBySymbol({ symbol: 'DAI' })
  const collateralToken = await params.chain.tokens.getTokenBySymbol({ symbol: 'WETH' })

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
    riskRatio: RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 20.3 }) }),
    pool: {
      poolId: { id: 'testpool' },
      protocolId: { id: 'testprotocol' },
      type: PoolType.Lending,
    },
  }
}
