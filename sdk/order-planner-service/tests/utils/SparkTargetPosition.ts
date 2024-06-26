import { EmodeType } from '@summerfi/protocol-plugins/plugins/common'
import {
  ISparkLendingPool,
  ISparkLendingPoolData,
  ISparkLendingPoolIdData,
  ISparkProtocolData,
  SparkLendingPool,
  SparkPositionId,
} from '@summerfi/protocol-plugins/plugins/spark'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Position,
  PositionId,
  PositionType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'

export function getSparkPosition(): Position {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
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

  const protocol: ISparkProtocolData = {
    name: ProtocolName.Spark,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }

  const poolId: ISparkLendingPoolIdData = {
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    emodeType: EmodeType.None,
  }

  const pool: ISparkLendingPool = SparkLendingPool.createFrom({
    type: PoolType.Lending,
    id: poolId,
    debtToken: DAI,
    collateralToken: WETH,
  })

  const position = {
    type: PositionType.Multiply,
    id: SparkPositionId.createFrom({ id: 'sparkPosition' }),
    debtAmount,
    collateralAmount,
    pool,
  } as unknown as Position

  return position
}
