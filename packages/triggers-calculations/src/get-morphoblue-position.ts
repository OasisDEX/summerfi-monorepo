import { PositionLike, TokenBalance } from '@summerfi/triggers-shared'
import { Address, PoolId } from '@summerfi/serverless-shared'
import { PublicClient } from 'viem'
import { chainlinkPairOracleAbi, erc20Abi, morphoBlueAbi } from '@summerfi/abis'
import { Logger } from '@aws-lambda-powertools/logger'
import { calculateLtv } from './helpers'

export interface GetMorphoBluePositionParams {
  address: Address
  collateral: Address
  debt: Address
  poolId: PoolId
}

export const ONE = 1n
export const TEN = 10n

const VIRTUAL_SHARES = TEN ** 6n
const VIRTUAL_ASSETS = 1n

function mulDivDown(x: bigint, y: bigint, d: bigint): bigint {
  return (x * y) / d
}

function toAssetsDown(shares: bigint, totalAssets: bigint, totalShares: bigint): bigint {
  return mulDivDown(shares, totalAssets + VIRTUAL_ASSETS, totalShares + VIRTUAL_SHARES)
}

export async function getMorphoBluePosition(
  { address, collateral, debt, poolId }: GetMorphoBluePositionParams,
  publicClient: PublicClient,
  addresses: { morphoBlue: Address },
  logger?: Logger,
): Promise<PositionLike> {
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
  const [oraclePriceTemp] = await publicClient.multicall({
    contracts: [
      {
        abi: chainlinkPairOracleAbi,
        address: oracleAddress,
        functionName: 'price',
      },
    ],
    allowFailure: false,
  })

  const collateralPriceInDebt =
    (oraclePriceTemp * 10n ** 18n) /
    10n ** (36n + BigInt(debtDecimals) - BigInt(collateralDecimals))

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

  const ltv = calculateLtv({
    collateral: collateralResult,
    debt: debtResult,
    collateralPriceInDebt,
  })

  console.log('DEBUG', {
    debtAmount: debtResult.balance.toString(),
    collateralAmount: collateralResult.balance.toString(),
    debtDecimals: debtResult.token.decimals.toString(),
    collateralDecimals: collateralResult.token.decimals.toString(),
    oracleMarketPrice: collateralPriceInDebt.toString(),
    ltv: ltv.toString(),
  })

  logger?.debug('Position data', {
    debt: debtResult,
    collateral: collateralResult,
    oracleMarketPrice: collateralPriceInDebt.toString(),
    ltv: ltv.toString(),
  })

  return {
    hasStablecoinDebt: false,
    ltv,
    collateral: collateralResult,
    debt: debtResult,
    address: address,
    oraclePrices: {
      collateralPrice: 1n,
      debtPrice: 1n,
    },
    collateralPriceInDebt: 1n,
    netValueUSD: 1n,
    debtValueUSD: 1n,
    collateralValueUSD: 1n,
  }
}

// collateral: collateralResult,
// debt: debtResult,
// address: address,
// oraclePrices: {
//   collateralPrice,
//   debtPrice,
// },
// collateralPriceInDebt,
// netValueUSD: netValue,
// debtValueUSD,
// collateralValueUSD,
