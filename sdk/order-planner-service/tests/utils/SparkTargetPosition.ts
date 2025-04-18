import { EmodeType } from '@summerfi/protocol-plugins'
import {
  ISparkLendingPool,
  ISparkLendingPosition,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkLendingPosition,
  SparkLendingPositionId,
  SparkProtocol,
} from '@summerfi/protocol-plugins'
import {
  LendingPositionType,
  Address,
  ChainFamilyMap,
  ChainInfo,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'

export function getSparkPosition(): ISparkLendingPosition {
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

  const protocol = SparkProtocol.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })

  const poolId = SparkLendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    emodeType: EmodeType.None,
  })

  const pool: ISparkLendingPool = SparkLendingPool.createFrom({
    id: poolId,
    debtToken: DAI,
    collateralToken: WETH,
  })

  const position = SparkLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: SparkLendingPositionId.createFrom({ id: 'sparkPosition' }),
    debtAmount,
    collateralAmount,
    pool,
  })

  return position
}
