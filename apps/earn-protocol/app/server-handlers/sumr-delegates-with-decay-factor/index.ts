import { getSumrDecayFactor } from '@/app/server-handlers/sumr-decay-factor'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'

/**
 * Retrieves SUMR delegates with their associated decay factors.
 *
 * A decay factor is applied to delegate voting power based on time elapsed,
 * reducing influence over time according to protocol rules. The decay factor
 * is a multiplier between 0 and 1 that decreases as time passes.
 *
 * @returns {Promise<{
 *   sumrDelegates: SumrDelegates[];
 *   sumrDecayFactors: SumrDecayFactorData[];
 * }>} Object containing:
 *   - sumrDelegates: Array of delegate information including account details
 *   - sumrDecayFactors: Array of decay factors corresponding to each delegate
 * @throws Will return empty arrays for both properties if either fetch operation fails
 */
export const getSumrDelegatesWithDecayFactor = async () => {
  try {
    const sumrDelegates = await getSumrDelegates()
    const addresses = sumrDelegates.map((delegate) => delegate.account.address)

    try {
      const sumrDecayFactors = addresses.length > 0 ? await getSumrDecayFactor(addresses) : []

      return { sumrDelegates, sumrDecayFactors }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching $SUMR decay factors:', error)

      return { sumrDelegates, sumrDecayFactors: [] }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching $SUMR delegates:', error)

    return { sumrDelegates: [], sumrDecayFactors: [] }
  }
}
