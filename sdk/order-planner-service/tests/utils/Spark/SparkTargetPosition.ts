import { ChainFamilyMap } from '@summerfi/sdk-client'
import {
  Address,
  ChainInfo,
  Position,
  PositionId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { EmodeType, PoolType, ProtocolName, SparkPoolId } from '@summerfi/sdk-common/protocols'

export function getSparkPosition(): Position {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const collateralAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '5.0',
  })

  const debtAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '700.0',
  })

  const protocol = {
    name: ProtocolName.Spark,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }

  const poolId = {
    protocol: ProtocolName.Spark,
    emodeType: EmodeType.None,
  } as SparkPoolId

  const pool = {
    type: PoolType.Lending,
    protocol,
    poolId,
  }

  const position = new Position({
    positionId: PositionId.createFrom({ id: 'sparkPosition' }),
    debtAmount,
    collateralAmount,
    pool,
  })

  return position
}
