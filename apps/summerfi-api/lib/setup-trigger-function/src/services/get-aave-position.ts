import { ONE_DOLLAR, PositionLike, Price, PRICE_DECIMALS, TEN_CENTS, TokenBalance } from '~types'
import { Address } from '@summerfi/serverless-shared/domain-types'
import { PublicClient } from 'viem'
import { Addresses } from './get-addresses'
import { aavePoolDataProviderAbi, aaveOracleAbi, erc20Abi } from '~abi'
import { calculateLtv } from './calculate-ltv'
import { Logger } from '@aws-lambda-powertools/logger'

function isStablecoin(tokenPrice: Price) {
  const difference = tokenPrice - ONE_DOLLAR
  const abs = difference < 0 ? -difference : difference

  return abs < TEN_CENTS
}

export interface GetPositionParams {
  address: Address
  collateral: Address
  debt: Address
}
export async function getAavePosition(
  { address, collateral, debt }: GetPositionParams,
  publicClient: PublicClient,
  addresses: Addresses,
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
        address: addresses.AaveV3.AaveDataPoolProvider,
        functionName: 'getUserReserveData',
        args: [collateral, address],
      },
      {
        abi: aavePoolDataProviderAbi,
        address: addresses.AaveV3.AaveDataPoolProvider,
        functionName: 'getUserReserveData',
        args: [debt, address],
      },
      {
        abi: aaveOracleAbi,
        address: addresses.AaveV3.AaveOracle,
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

  logger?.debug('Position data', {
    debt: debtResult,
    collateral: collateralResult,
    collateralPriceInDebt,
    ltv,
  })

  return {
    hasStablecoinDebt: isStablecoin(debtPrice),
    ltv,
    collateral: collateralResult,
    debt: debtResult,
    address: address,
    prices: {
      collateralPrice,
      debtPrice,
    },
  }
}
