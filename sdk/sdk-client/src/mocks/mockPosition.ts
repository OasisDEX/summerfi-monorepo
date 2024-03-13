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
    address: Address.createFrom({ value: '0x6b175474e89094c44da98b954eedeac495271d0f' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    chainInfo: params.chainInfo,
  })

  const collateralToken = Token.createFrom({
    symbol: TokenSymbol.WETH,
    address: Address.createFrom({ value: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' }),
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
    }),
    pool: {
      poolId: {
        protocol: ProtocolName.Maker,
        ilkType: ILKType.ETH_A,
        vaultId: 'testvault',
      } as MakerPoolId,
      protocol: {
        name: ProtocolName.Maker,
        chainInfo: params.chainInfo,
      },
      type: PoolType.Lending,
    },
  }
}
