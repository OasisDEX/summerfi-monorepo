/**
 * @param price - price ratio in morpho format (price * 10 ** (36 + quoteDecimals - collateralDecimals)), i.e. 2,123.42 WSTETH/USDC -> 2123420000000000000000000000n
 * @param debtDecimals - decimals of debt token
 * @param collateralDecimals - decimals of collateral token
 *
 * @returns Returns price converted to lambda format (chainlink precision with 8 decimals)
 */

export const getMorphoLambdaPriceConverted = ({
  price,
  debtDecimals,
  collateralDecimals,
}: {
  price: bigint | number | string
  debtDecimals: bigint | number | string
  collateralDecimals: bigint | number | string
}) => BigInt(price) / 10n ** (36n + BigInt(debtDecimals) - BigInt(collateralDecimals) - 8n)
