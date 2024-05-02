import {
  Address,
  ChainInfo,
  Token,
  TokenAmount,
  borrowFromPosition,
  depositToPosition,
  newEmptyPositionFromPool,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import { ILKType, MakerLendingPool } from '@summerfi/protocol-plugins/plugins/maker'
import { SparkLendingPool } from '@summerfi/protocol-plugins/plugins/spark'
import { ISparkProtocolData } from 'node_modules/@summerfi/protocol-plugins/src/plugins/spark/interfaces/ISparkProtocol'
import { EmodeType } from '@summerfi/protocol-plugins'
import { IMakerProtocolData } from 'node_modules/@summerfi/protocol-plugins/src/plugins/maker/interfaces/IMakerProtocol'

const testChain = ChainInfo.createFrom({ chainId: 1, name: 'test' })

const testCollateral = Token.createFrom({
  chainInfo: testChain,
  address: Address.createFromEthereum({ value: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' }),
  decimals: 18,
  name: 'Collateral',
  symbol: 'COL',
})

const testDebt = Token.createFrom({
  chainInfo: testChain,
  address: Address.createFromEthereum({ value: '0x814FaE9f487206471B6B0D713cD51a2D35980000' }),
  decimals: 18,
  name: 'Debt',
  symbol: 'DBT',
})

export const otherTestCollateral = Token.createFrom({
  chainInfo: testChain,
  address: Address.createFromEthereum({ value: '0x15222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5' }),
  decimals: 5,
  name: 'Collateral2',
  symbol: 'COL',
})

export const otherTestDebt = Token.createFrom({
  chainInfo: testChain,
  address: Address.createFromEthereum({ value: '0x114FaE9f487206471B6B0D713cD51a2D35980000' }),
  decimals: 3,
  name: 'Debt2',
  symbol: 'DBT2',
})

export const testSourceProtocol: IMakerProtocolData = {
  chainInfo: testChain,
  name: ProtocolName.Maker,
}

export const testTargetProtocol: ISparkProtocolData = {
  chainInfo: testChain,
  name: ProtocolName.Spark,
}

const testSourceLendingPool = MakerLendingPool.createFrom({
  type: PoolType.Lending,
  id: {
    protocol: testSourceProtocol,
    collateralToken: testCollateral,
    debtToken: testDebt,
    ilkType: ILKType.ETH_A,
  },
})

export const testSourcePosition = borrowFromPosition(
  depositToPosition(
    newEmptyPositionFromPool(testSourceLendingPool),
    TokenAmount.createFrom({ token: testCollateral, amount: '100' }),
  ),
  TokenAmount.createFrom({ token: testDebt, amount: '50' }),
)

export const testTargetLendingPool = SparkLendingPool.createFrom({
  type: PoolType.Lending,
  id: {
    protocol: testTargetProtocol,
    collateralToken: testCollateral,
    debtToken: testDebt,
    emodeType: EmodeType.None,
  },
})

export const testTargetLendingPoolRequiredSwaps = SparkLendingPool.createFrom({
  type: PoolType.Lending,
  id: {
    protocol: testTargetProtocol,
    collateralToken: otherTestCollateral,
    debtToken: otherTestDebt,
    emodeType: EmodeType.None,
  },
})
