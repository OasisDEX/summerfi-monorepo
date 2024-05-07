import { PRICE_DECIMALS, PositionLike, TokenBalance } from '@summerfi/triggers-shared'
import { Address, ChainId, PoolId } from '@summerfi/serverless-shared'
import { PublicClient } from 'viem'
import { chainlinkPairOracleAbi, erc20Abi, morphoBlueAbi } from '@summerfi/abis'
import { Logger } from '@aws-lambda-powertools/logger'
import { calculateLtv, normalizeAmount } from './helpers'
import { UsdcAndTokenPrice, getPricesSubgraphClient } from '@summerfi/prices-subgraph'
import BigNumber from 'bignumber.js'

export interface GetMorphoBluePositionParams {
  address: Address
  collateral: Address
  debt: Address
  poolId: PoolId
}

export const ONE = 1n
export const TEN = 10n
export const USDC_DECIMALS = 8
export const MB_ORACLE_DECIMALS = 36

const VIRTUAL_SHARES = TEN ** 6n
const VIRTUAL_ASSETS = 1n

function mulDivDown(x: bigint, y: bigint, d: bigint): bigint {
  return (x * y) / d
}

function toAssetsDown(shares: bigint, totalAssets: bigint, totalShares: bigint): bigint {
  return mulDivDown(shares, totalAssets + VIRTUAL_ASSETS, totalShares + VIRTUAL_SHARES)
}

function calculateTokenPrices({
  collateralData,
  debtData,
  collateralPriceInDebt,
}: {
  collateralData: UsdcAndTokenPrice
  debtData: UsdcAndTokenPrice
  collateralPriceInDebt: bigint
  collateralDecimals: number
  debtDecimals: number
}) {
  const usdcDecimals = 10 ** USDC_DECIMALS
  const priceDecimalsNumber = Number(PRICE_DECIMALS.toString())
  const priceDecimalsExp = 10 ** priceDecimalsNumber
  if (
    collateralData.tokenInUsdcPrice &&
    collateralData.usdcPrice &&
    debtData.tokenInUsdcPrice &&
    debtData.usdcPrice
  ) {
    // we have both prices
    const collateralPrice = new BigNumber(collateralData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(collateralData.usdcPrice.toString()).div(usdcDecimals))
    const debtPrice = new BigNumber(debtData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(debtData.usdcPrice.toString()).div(usdcDecimals))
    return {
      collateralPrice: BigInt(collateralPrice.times(priceDecimalsExp).toFixed(0)),
      debtPrice: BigInt(debtPrice.times(priceDecimalsExp).toFixed(0)),
    }
  }

  if (debtData.tokenInUsdcPrice && debtData.usdcPrice) {
    // we have a debt price only, so we calculate the collateral price
    // based on the collateral price in debt (from MB oracle)
    const debtPrice = new BigNumber(debtData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(debtData.usdcPrice.toString()).div(usdcDecimals))
    const collateralPrice = debtPrice.times(
      new BigNumber(collateralPriceInDebt.toString()).div(10 ** priceDecimalsNumber),
    )
    return {
      collateralPrice: BigInt(collateralPrice.times(priceDecimalsExp).toFixed(0)),
      debtPrice: BigInt(debtPrice.times(priceDecimalsExp).toFixed(0)),
    }
  }
  if (collateralData.tokenInUsdcPrice && collateralData.usdcPrice) {
    // we have a collateral price only, so we do the same as above but multiply
    // by the inverse of the collateral price in debt
    const debtPrice = new BigNumber(collateralData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(collateralData.usdcPrice.toString()).div(usdcDecimals))
    const collateralPrice = debtPrice.times(
      new BigNumber(new BigNumber(1).div(collateralPriceInDebt.toString()).toString()).div(
        10 ** priceDecimalsNumber,
      ),
    )
    return {
      collateralPrice: BigInt(collateralPrice.times(priceDecimalsExp).toFixed(0)),
      debtPrice: BigInt(debtPrice.times(priceDecimalsExp).toFixed(0)),
    }
  }
  throw new Error('Cannot calculate token prices')
}

export async function getMorphoBluePosition(
  { address, collateral, debt, poolId }: GetMorphoBluePositionParams,
  publicClient: PublicClient,
  addresses: { morphoBlue: Address },
  logger?: Logger,
): Promise<PositionLike> {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const [
    [, , oracleAddress],
    [, , totalBorrowAssets, totalBorrowShares],
    [, borrowShares, collateralAmount],
    collateralDecimals,
    collateralSymbol,
    debtDecimals,
    debtSymbol,
  ] = await publicClient.multicall({
    contracts: [
      {
        abi: morphoBlueAbi,
        address: addresses.morphoBlue,
        functionName: 'idToMarketParams',
        args: [poolId],
      },
      {
        abi: morphoBlueAbi,
        address: addresses.morphoBlue,
        functionName: 'market',
        args: [poolId],
      },
      {
        abi: morphoBlueAbi,
        address: addresses.morphoBlue,
        functionName: 'position',
        args: [poolId, address],
      },
      {
        abi: erc20Abi,
        address: collateral,
        functionName: 'decimals',
      },
      {
        abi: erc20Abi,
        address: collateral,
        functionName: 'symbol',
      },
      {
        abi: erc20Abi,
        address: debt,
        functionName: 'decimals',
      },
      {
        abi: erc20Abi,
        address: debt,
        functionName: 'symbol',
      },
    ],
    allowFailure: false,
  })
  const [oraclePrice] = await publicClient.multicall({
    contracts: [
      {
        abi: chainlinkPairOracleAbi,
        address: oracleAddress,
        functionName: 'price',
      },
    ],
    allowFailure: false,
  })

  const pricesClient = getPricesSubgraphClient({
    chainId: ChainId.MAINNET,
    urlBase: SUBGRAPH_BASE as string,
    logger,
  })
  const [collateralData, debtData] = await Promise.all([
    await pricesClient.getUsdcAndTokenPrice({ token: collateral }),
    await pricesClient.getUsdcAndTokenPrice({ token: debt }),
  ])

  const collateralPriceInDebt = normalizeAmount(
    oraclePrice,
    MB_ORACLE_DECIMALS + debtDecimals - collateralDecimals,
    Number(PRICE_DECIMALS.toString()),
  )

  const debtAmount = toAssetsDown(borrowShares, totalBorrowAssets, totalBorrowShares)

  if (!collateralPriceInDebt) {
    throw new Error('Invalid oracle price')
  }

  const collateralResult: TokenBalance = {
    balance: collateralAmount,
    token: {
      decimals: collateralDecimals || 18,
      symbol: collateralSymbol || '',
      address: collateral,
    },
  }

  const debtResult: TokenBalance = {
    balance: debtAmount,
    token: {
      decimals: debtDecimals || 18,
      symbol: debtSymbol || '',
      address: debt,
    },
  }

  const { collateralPrice, debtPrice } = calculateTokenPrices({
    collateralData,
    debtData,
    collateralPriceInDebt,
    collateralDecimals,
    debtDecimals,
  })

  const ltv = calculateLtv({
    collateral: collateralResult,
    debt: debtResult,
    collateralPriceInDebt,
  })

  const collateralValueUSD = collateralAmount * collateralPrice
  const debtValueUSD = debtAmount * debtPrice

  const netValue = collateralValueUSD - debtValueUSD

  logger?.debug('Position data', {
    debt: debtResult,
    collateral: collateralResult,
    oracleMarketPrice: collateralPriceInDebt.toString(),
    ltv: ltv.toString(),
    netValue: netValue.toString(),
  })

  return {
    hasStablecoinDebt: false,
    ltv,
    collateral: collateralResult,
    debt: debtResult,
    address: address,
    oraclePrices: {
      // not an actual oracle prices, but should be pretty close
      collateralPrice,
      debtPrice,
    },
    collateralPriceInDebt,
    netValueUSD: netValue,
    debtValueUSD,
    collateralValueUSD,
  }
}
