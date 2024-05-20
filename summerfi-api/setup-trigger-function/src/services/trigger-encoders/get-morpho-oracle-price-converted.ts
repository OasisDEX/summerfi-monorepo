/**
 * @param price - price ratio in lambda format (chainlink precision with 8 decimals), i.e. 2,123.42 WSTETH/USDC -> 212342000000
 * @param debtDecimals - decimals of debt token
 * @param collateralDecimals - decimals of collateral token
 *
 * @returns Returns price converted to morpho oracles format which is price * 10 ** (36 + quoteDecimals - collateralDecimals)
 */

export const getMorphoOraclePriceConverted = ({
  price,
  debtDecimals,
  collateralDecimals,
}: {
  price: bigint
  debtDecimals: number
  collateralDecimals: number
}) => price * 10n ** (36n + BigInt(debtDecimals) - BigInt(collateralDecimals) - 8n)
