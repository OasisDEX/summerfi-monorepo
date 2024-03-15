import {
  Percentage,
  RiskRatio,
  TokenAmount,
  TokenSymbol,
  type Maybe,
  type Position,
  type PositionId,
  type Wallet,
  ChainInfo,
  Token,
  Address,
} from '@summerfi/sdk-common/common'
import { ILKType, MakerPoolId, PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'

export async function getMockPosition(params: {
  chainInfo: ChainInfo
  wallet: Wallet
  id: PositionId
}): Promise<Maybe<Position>> {
  const debtToken = Token.createFrom({
    symbol: TokenSymbol.DAI,
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    chainInfo: params.chainInfo,
  })

  const collateralToken = Token.createFrom({
    symbol: TokenSymbol.WETH,
    address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    decimals: 18,
    name: 'Wrapped Ether',
    chainInfo: params.chainInfo,
  })

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
      poolId: {
        protocol: { name: ProtocolName.Maker, chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }) } ,
        ilkType: ILKType.ETH_A,
      } as MakerPoolId,
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: params.chainInfo,
      },
      type: PoolType.Lending,
    },
  }
}
