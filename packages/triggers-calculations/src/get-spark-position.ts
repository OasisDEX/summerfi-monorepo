import { PositionLike, PRICE_DECIMALS, TokenBalance } from '@summerfi/triggers-shared'
import { Address } from '@summerfi/serverless-shared'
import { PublicClient } from 'viem'
import { aavePoolDataProviderAbi, aaveOracleAbi, erc20Abi } from '@summerfi/abis'
import { calculateLtv, isStablecoin } from './helpers'
import { Logger } from '@aws-lambda-powertools/logger'

export interface GetSparkPositionParams {
  address: Address
  collateral: Address
  debt: Address
}
export async function getSparkPosition(
  { address, collateral, debt }: GetSparkPositionParams,
  publicClient: PublicClient,
  addresses: { poolDataProvider: Address; oracle: Address },
  logger?: Logger,
): Promise<PositionLike> {
  const [
    collateralData,
    debtData,
    oraclePrices,
    collateralDecimals,
    collateralSymbol,
    debtDecimals,
    debtSymbol,
  ] = await publicClient.multicall({
    contracts: [
      {
        abi: aavePoolDataProviderAbi,
        address: addresses.poolDataProvider,
        functionName: 'getUserReserveData',
        args: [collateral, address],
      },
      {
        abi: aavePoolDataProviderAbi,
        address: addresses.poolDataProvider,
        functionName: 'getUserReserveData',
        args: [debt, address],
      },
      {
        abi: aaveOracleAbi,
        address: addresses.oracle,
        functionName: 'getAssetsPrices',
        args: [[collateral, debt]],
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
    allowFailure: true,
  })

  const collateralAmount = collateralData.status === 'success' ? collateralData.result[0] : 0n
  const debtAmount = debtData.status === 'success' ? debtData.result[1] + debtData.result[2] : 0n

  const [collateralPrice, debtPrice] =
    oraclePrices.status === 'success' ? oraclePrices.result : [0n, 0n]

  const collateralPriceInDebt =
    collateralPrice == 0n || debtPrice === 0n
      ? 0n
      : (collateralPrice * 10n ** PRICE_DECIMALS) / debtPrice

  const collateralResult: TokenBalance = {
    balance: collateralAmount,
    token: {
      decimals: collateralDecimals.status === 'success' ? collateralDecimals.result : 18,
      symbol: collateralSymbol.status === 'success' ? collateralSymbol.result : '',
      address: collateral,
    },
  }

  const debtResult: TokenBalance = {
    balance: debtAmount,
    token: {
      decimals: debtDecimals.status === 'success' ? debtDecimals.result : 18,
      symbol: debtSymbol.status === 'success' ? debtSymbol.result : '',
      address: debt,
    },
  }

  const ltv = calculateLtv({
    collateral: collateralResult,
    debt: debtResult,
    collateralPriceInDebt,
  })

  const debtValueUSD = (debtAmount * debtPrice) / 10n ** BigInt(debtResult.token.decimals)

  const collateralValueUSD =
    (collateralAmount * collateralPrice) / 10n ** BigInt(collateralResult.token.decimals)

  const netValue = collateralValueUSD - debtValueUSD

  logger?.debug('Position data', {
    debt: debtResult,
    collateral: collateralResult,
    collateralPriceInDebt,
    ltv,
    netValue,
  })

  return {
    hasStablecoinDebt: isStablecoin(debtPrice),
    ltv,
    collateral: collateralResult,
    debt: debtResult,
    address: address,
    oraclePrices: {
      collateralPrice,
      debtPrice,
    },
    collateralPriceInDebt,
    netValueUSD: netValue,
    debtValueUSD,
    collateralValueUSD,
  }
}
