import { Chain, type ChainInfo } from '~sdk-common/chains'
import { Percentage, RiskRatio, TokenAmount, Wallet } from '~sdk-common/common'
import { getMockTokenBySymbol } from '~sdk-common/mocks'
import { PoolType } from '~sdk-common/protocols'
import { PositionId, type Position, type PositionSerialized } from '~sdk-common/users'
import { Maybe } from '~sdk-common/utils'

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

export async function getMockPositionSerialized(params: {
  chainInfo: ChainInfo
  wallet: Wallet
  id: PositionId
}): Promise<PositionSerialized | undefined> {
  const debtToken = await getMockTokenBySymbol({ symbol: 'DAI', chainInfo: params.chainInfo })
  const collateralToken = await getMockTokenBySymbol({
    symbol: 'WETH',
    chainInfo: params.chainInfo,
  })

  if (!debtToken || !collateralToken) {
    return undefined
  }

  return {
    positionId: params.id,
    debtAmount: TokenAmount.createFrom({ token: debtToken, amount: '56.78' }).serialize(),
    collateralAmount: TokenAmount.createFrom({
      token: collateralToken,
      amount: '105.98',
    }).serialize(),
    riskRatio: RiskRatio.createFrom({
      ratio: Percentage.createFrom({ percentage: 20.3 }),
    }).serialize(),
    pool: {
      poolId: { id: 'testpool' },
      protocolId: { id: 'testprotocol' },
      type: PoolType.Lending,
    },
  }
}
