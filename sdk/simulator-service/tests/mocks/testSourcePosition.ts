import {
  Address,
  ChainInfo,
  RiskRatioType,
  Token,
  TokenAmount,
  borrowFromPosition,
  depositToPosition,
  newEmptyPositionFromPool,
  CollateralInfo,
  DebtInfo,
  FiatCurrency,
  Percentage,
  Price,
  RiskRatio,
} from '@summerfi/sdk-common'

import {
  EmodeType,
  ILKType,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerProtocol,
  SparkLendingPool,
  SparkLendingPoolId,
  SparkLendingPoolInfo,
  SparkProtocol,
} from '@summerfi/protocol-plugins'

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

export const testSourceProtocol = MakerProtocol.createFrom({
  chainInfo: testChain,
})

export const testTargetProtocol = SparkProtocol.createFrom({
  chainInfo: testChain,
})

const testSourceLendingPool = MakerLendingPool.createFrom({
  id: MakerLendingPoolId.createFrom({
    protocol: testSourceProtocol,
    collateralToken: testCollateral,
    debtToken: testDebt,
    ilkType: ILKType.ETH_A,
  }),
  debtToken: testDebt,
  collateralToken: testCollateral,
})

export const testSourcePosition = borrowFromPosition(
  depositToPosition(
    newEmptyPositionFromPool(testSourceLendingPool),
    TokenAmount.createFrom({ token: testCollateral, amount: '100' }),
  ),
  TokenAmount.createFrom({ token: testDebt, amount: '50' }),
)

export const testTargetLendingPool = SparkLendingPool.createFrom({
  id: SparkLendingPoolId.createFrom({
    protocol: testTargetProtocol,
    collateralToken: testCollateral,
    debtToken: testDebt,
    emodeType: EmodeType.None,
  }),
  collateralToken: testCollateral,
  debtToken: testDebt,
})

export const testTargetLendingPoolRequiredSwaps = SparkLendingPool.createFrom({
  id: SparkLendingPoolId.createFrom({
    protocol: testTargetProtocol,
    collateralToken: otherTestCollateral,
    debtToken: otherTestDebt,
    emodeType: EmodeType.None,
  }),
  collateralToken: otherTestCollateral,
  debtToken: otherTestDebt,
})

export const testTargetLendingPoolInfo = SparkLendingPoolInfo.createFrom({
  id: SparkLendingPoolId.createFrom({
    protocol: testTargetProtocol,
    collateralToken: testCollateral,
    debtToken: testDebt,
    emodeType: EmodeType.None,
  }),
  collateral: CollateralInfo.createFrom({
    price: Price.createFrom({
      value: '100',
      base: testCollateral,
      quote: FiatCurrency.USD,
    }),
    priceUSD: Price.createFrom({
      value: '200',
      base: testCollateral,
      quote: FiatCurrency.USD,
    }),
    token: testCollateral,
    tokensLocked: TokenAmount.createFrom({ token: testCollateral, amount: '10000' }),
    liquidationPenalty: Percentage.createFrom({ value: 0.1 }),
    liquidationThreshold: RiskRatio.createFrom({
      value: Percentage.createFrom({ value: 0.6 }),
      type: RiskRatioType.LTV,
    }),
    maxSupply: TokenAmount.createFrom({ token: testCollateral, amount: '10000000' }),
  }),
  debt: DebtInfo.createFrom({
    price: Price.createFrom({ value: '300', base: testDebt, quote: FiatCurrency.USD }),
    priceUSD: Price.createFrom({
      value: '500',
      base: testDebt,
      quote: FiatCurrency.USD,
    }),
    token: testDebt,
    totalBorrowed: TokenAmount.createFrom({ token: testDebt, amount: '10000' }),
    debtAvailable: TokenAmount.createFrom({ token: testDebt, amount: '50000' }),
    debtCeiling: TokenAmount.createFrom({ token: testDebt, amount: '100000' }),
    dustLimit: TokenAmount.createFrom({ token: testDebt, amount: '0.001' }),
    interestRate: Percentage.createFrom({ value: 0.1 }),
    originationFee: Percentage.createFrom({ value: 0.01 }),
  }),
})
