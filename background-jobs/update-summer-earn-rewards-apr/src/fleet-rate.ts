/**
 * Pure helpers for combining a fleet's ark rates into a single weighted APR.
 *
 * Kept free of runtime imports (DB, subgraph clients, logger) so they can be
 * unit-tested under the package's CJS ts-jest transform without loading the
 * ESM-only workspace packages that `index.ts` pulls in.
 */

/** Per-ark base + reward breakdown that feeds the weighted fleet rate. */
export interface FleetArkTotalRate {
  productId: string
  baseRate: number
  offchainRate: number | undefined
  rewardRate: number
  totalRate: number
}

/**
 * Resolves the base APR for each product and folds in its reward rate to
 * produce the per-ark total rate.
 *
 * Base-rate precedence: the on-chain subgraph rate wins whenever it is present
 * and non-zero. Offchain samples (written by the update-offchain-apr job for
 * protocols with no usable on-chain signal, e.g. institutional RWAs) fill in
 * only when the subgraph rate is missing or zero. Products with no base rate
 * from either source are dropped (they cannot contribute to the fleet rate).
 */
export function computeFleetArksTotalRates(params: {
  products: Array<{ id: string; interestRates: Array<{ rate: string | number }> }>
  rewardRatesByProductId: Map<string, number>
  offchainRatesByProductId: Map<string, number>
  onMissingBaseRate?: (productId: string) => void
}): FleetArkTotalRate[] {
  const { products, rewardRatesByProductId, offchainRatesByProductId, onMissingBaseRate } = params

  return products.flatMap((product) => {
    const subgraphRate = product.interestRates[0] ? +product.interestRates[0].rate : undefined
    const offchainRate = offchainRatesByProductId.get(product.id)
    // Offchain samples exist only for protocols without a usable on-chain
    // signal, so they take over whenever the subgraph has no (or a zero) rate.
    const baseRate = subgraphRate ? subgraphRate : (offchainRate ?? subgraphRate)
    if (baseRate === undefined) {
      onMissingBaseRate?.(product.id)
      return []
    }
    const rewardRate = rewardRatesByProductId.get(product.id) ?? 0
    const totalRate = rewardRate + baseRate || baseRate
    return [{ productId: product.id, baseRate, offchainRate, rewardRate, totalRate }]
  })
}

/**
 * TVL-weighted average of the per-ark total rates. Arks whose ratio is unknown
 * (should not happen: total rates are derived from the same ark set) contribute
 * nothing rather than corrupting the sum with NaN.
 */
export function computeWeightedFleetRate(
  totalRates: Array<{ productId: string; totalRate: number }>,
  arkRatiosByProductId: Map<string, number>,
): number {
  return totalRates.reduce((acc, { productId, totalRate }) => {
    const ratio = arkRatiosByProductId.get(productId)
    if (ratio === undefined) {
      return acc
    }
    return acc + totalRate * ratio
  }, 0)
}
