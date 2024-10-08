import { PositionLike, PRICE_DECIMALS, TokenBalance } from '@summerfi/triggers-shared'
import { Address, ChainId, PoolId } from '@summerfi/serverless-shared'
import { PublicClient } from 'viem'
import { chainlinkPairOracleAbi, erc20Abi, morphoBlueAbi } from '@summerfi/abis'
import { Logger } from '@aws-lambda-powertools/logger'
import { calculateLtv, isStablecoin, normalizeAmount } from './helpers'
import { getPricesSubgraphClient, UsdcAndTokenPrice } from '@summerfi/prices-subgraph'
import { BigNumber } from 'bignumber.js'

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

async function safeSymbolCall(token: Address, publicClient: PublicClient): Promise<string> {
  // MKR is not regular ERC20 and the symbol is in bytes32
  // so we need to hardcode it
  if (token.toLowerCase() === '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2') {
    return 'MKR'
  }
  const symbol = await publicClient.multicall({
    contracts: [
      {
        abi: erc20Abi,
        address: token,
        functionName: 'symbol',
      },
    ],
    allowFailure: false,
  })
  return symbol[0]
}

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
    const debtPriceWithDecimals = new BigNumber(debtData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(debtData.usdcPrice.toString()).div(usdcDecimals))

    const debtPriceBigIntReady = debtPriceWithDecimals.times(priceDecimalsExp).toFixed(0)

    const collateralPrice = new BigNumber(debtPriceBigIntReady).times(
      new BigNumber(collateralPriceInDebt.toString()),
    )
    const collateralPriceBigIntReady = collateralPrice.times(priceDecimalsExp).toFixed(0)

    return {
      collateralPrice: BigInt(collateralPriceBigIntReady),
      debtPrice: BigInt(debtPriceBigIntReady),
    }
  }

  if (collateralData.tokenInUsdcPrice && collateralData.usdcPrice) {
    // we have a collateral price only, so we do the same as above but multiply
    // by the inverse of the collateral price in debt
    const collateralPriceWithDecimals = new BigNumber(collateralData.tokenInUsdcPrice.toString())
      .div(usdcDecimals)
      .times(new BigNumber(collateralData.usdcPrice.toString()).div(usdcDecimals))

    const collateralPriceBigIntReady = collateralPriceWithDecimals
      .times(priceDecimalsExp)
      .toFixed(0)

    const debtPriceWithDecimals = new BigNumber(collateralPriceBigIntReady).times(
      new BigNumber(new BigNumber(1).div(collateralPriceInDebt.toString()).toString()),
    )

    const debtPriceBigIntReady = debtPriceWithDecimals.times(priceDecimalsExp).toFixed(0)

    return {
      collateralPrice: BigInt(collateralPriceBigIntReady),
      debtPrice: BigInt(debtPriceBigIntReady),
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
    debtDecimals,
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
        address: debt,
        functionName: 'decimals',
      },
    ],
    allowFailure: false,
  })
  const collateralSymbol = await safeSymbolCall(collateral, publicClient)
  const debtSymbol = await safeSymbolCall(debt, publicClient)
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
    pricesClient.getUsdcAndTokenPrice({ token: collateral }),
    pricesClient.getUsdcAndTokenPrice({ token: debt }),
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

  const collateralValueUSD =
    (collateralAmount * collateralPrice) / 10n ** BigInt(collateralResult.token.decimals)
  const debtValueUSD = (debtAmount * debtPrice) / 10n ** BigInt(debtResult.token.decimals)

  const netValue = collateralValueUSD - debtValueUSD

  logger?.debug('Position data', {
    debt: debtResult,
    collateral: collateralResult,
    collateralAmount: collateralAmount.toString(),
    debtAmount: debtAmount.toString(),
    collateralPrice: collateralPrice.toString(),
    debtPrice: debtPrice.toString(),
    oracleMarketPrice: collateralPriceInDebt.toString(),
    ltv: ltv.toString(),
    collateralValueUSD: collateralValueUSD.toString(),
    debtValueUSD: debtValueUSD.toString(),
    netValue: netValue.toString(),
  })

  return {
    hasStablecoinDebt: isStablecoin(debtPrice),
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
