import { MakerLendingPool, SparkLendingPool } from '@summerfi/protocol-plugins'
import {
  Address,
  ChainInfo,
  CurrencySymbol,
  Percentage,
  Price,
  RiskRatio,
  RiskRatioType,
  Token,
  TokenAmount,
  borrowFromPosition,
  depositToPosition,
  newEmptyPositionFromPool,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'

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

export const testSourceProtocol = {
  chainInfo: testChain,
  name: ProtocolName.Maker,
}

export const testTargetProtocol = {
  chainInfo: testChain,
  name: ProtocolName.Spark,
}

const testSourceLendingPool = MakerLendingPool.createFrom({
  type: PoolType.Lending,
  collaterals: {
    record: {
      [testCollateral.address.value]: {
        token: testCollateral,
        price: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: CurrencySymbol.USD,
        }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: CurrencySymbol.USD,
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 80 }),
          type: RiskRatio.type.LTV,
        }),
        maxSupply: TokenAmount.createFrom({ token: testCollateral, amount: '10000000' }),
        tokensLocked: TokenAmount.createFrom({ token: testCollateral, amount: '1000000' }),
        liquidationPenalty: Percentage.createFrom({ value: 5 }),
        nextPrice: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: CurrencySymbol.USD,
        }),
        nextPriceUpdate: new Date(Date.now() + 1000),
        lastPriceUpdate: new Date(Date.now() - 1000),
      },
    },
  },
  debts: {
    record: {
      [testDebt.address.value]: {
        token: testDebt,
        price: Price.createFrom({
          value: '100',
          baseToken: testDebt,
          quoteToken: CurrencySymbol.USD,
        }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testDebt,
          quoteToken: CurrencySymbol.USD,
        }),
        rate: Percentage.createFrom({ value: 5 }),
        totalBorrowed: TokenAmount.createFrom({ token: testDebt, amount: '100000' }),
        debtCeiling: TokenAmount.createFrom({ token: testDebt, amount: '1000000' }),
        debtAvailable: TokenAmount.createFrom({ token: testDebt, amount: '100000' }),
        dustLimit: TokenAmount.createFrom({ token: testDebt, amount: '100' }),
        originationFee: Percentage.createFrom({ value: 1 }),
      },
    },
  },
  baseCurrency: testCollateral,
  poolId: {
    protocol: testSourceProtocol,
  },
  protocol: testSourceProtocol,
})

export const testSourcePosition = borrowFromPosition(
  depositToPosition(
    newEmptyPositionFromPool(testSourceLendingPool, testDebt, testCollateral),
    TokenAmount.createFrom({ token: testCollateral, amount: '100' }),
  ),
  TokenAmount.createFrom({ token: testDebt, amount: '50' }),
)

export const testTargetLendingPool = SparkLendingPool.createFrom({
  type: PoolType.Lending,
  collaterals: {
    record: {
      [testCollateral.address.value]: {
        token: testCollateral,
        price: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: CurrencySymbol.USD,
        }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: CurrencySymbol.USD,
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 80 }),
          type: RiskRatio.type.LTV,
        }),
        maxSupply: TokenAmount.createFrom({ token: testCollateral, amount: '10000000' }),
        tokensLocked: TokenAmount.createFrom({ token: testCollateral, amount: '1000000' }),
        liquidationPenalty: Percentage.createFrom({ value: 5 }),
        usageAsCollateralEnabled: true,
        apy: Percentage.createFrom({ value: 0.5 }),
        maxLtv: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 10 }),
          type: RiskRatioType.LTV,
        }),
      },
    },
  },
  debts: {
    record: {
      [testDebt.address.value]: {
        token: testDebt,
        price: Price.createFrom({
          value: '100',
          baseToken: testDebt,
          quoteToken: CurrencySymbol.USD,
        }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testDebt,
          quoteToken: CurrencySymbol.USD,
        }),
        rate: Percentage.createFrom({ value: 5 }),
        totalBorrowed: TokenAmount.createFrom({ token: testDebt, amount: '100000' }),
        debtCeiling: TokenAmount.createFrom({ token: testDebt, amount: '1000000' }),
        debtAvailable: TokenAmount.createFrom({ token: testDebt, amount: '100000' }),
        dustLimit: TokenAmount.createFrom({ token: testDebt, amount: '100' }),
        originationFee: Percentage.createFrom({ value: 1 }),
        borrowingEnabled: true,
      },
    },
  },
  baseCurrency: testCollateral,
  poolId: {
    protocol: testTargetProtocol,
  },
  protocol: testTargetProtocol,
})

export const testTargetLendingPoolRequiredSwaps = SparkLendingPool.createFrom({
  type: PoolType.Lending,
  collaterals: {
    record: {
      [testDebt.address.value]: {
        token: testDebt,
        price: Price.createFrom({ value: '100', baseToken: testDebt, quoteToken: testCollateral }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testDebt,
          quoteToken: testCollateral,
        }),
        liquidationThreshold: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 80 }),
          type: RiskRatio.type.LTV,
        }),
        maxSupply: TokenAmount.createFrom({ token: testDebt, amount: '10000000' }),
        tokensLocked: TokenAmount.createFrom({ token: testDebt, amount: '1000000' }),
        liquidationPenalty: Percentage.createFrom({ value: 5 }),
        usageAsCollateralEnabled: true,
        apy: Percentage.createFrom({ value: 0.5 }),
        maxLtv: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 10 }),
          type: RiskRatioType.LTV,
        }),
      },
    },
  },
  debts: {
    record: {
      [testCollateral.address.value]: {
        token: testCollateral,
        price: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: testCollateral,
        }),
        priceUSD: Price.createFrom({
          value: '100',
          baseToken: testCollateral,
          quoteToken: testCollateral,
        }),
        rate: Percentage.createFrom({ value: 5 }),
        totalBorrowed: TokenAmount.createFrom({ token: testCollateral, amount: '100000' }),
        debtCeiling: TokenAmount.createFrom({ token: testCollateral, amount: '1000000' }),
        debtAvailable: TokenAmount.createFrom({ token: testCollateral, amount: '100000' }),
        dustLimit: TokenAmount.createFrom({ token: testCollateral, amount: '100' }),
        originationFee: Percentage.createFrom({ value: 1 }),
        borrowingEnabled: true,
      },
    },
  },
  baseCurrency: testCollateral,
  poolId: {
    protocol: testTargetProtocol,
  },
  protocol: testTargetProtocol,
})
