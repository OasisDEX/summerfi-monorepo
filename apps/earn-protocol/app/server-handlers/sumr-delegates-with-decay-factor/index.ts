import { getSumrDecayFactor } from '@/app/server-handlers/sumr-decay-factor'
import { getSumrDelegates } from '@/app/server-handlers/sumr-delegates'

/**
 * Retrieves SUMR delegates with their associated decay factors.
 *
 * A decay factor is applied to delegate voting power based on time elapsed,
 * reducing influence over time according to protocol rules.
 *
 * @returns {Promise<any>} A promise that resolves to the delegates data with decay factors
 * @throws {Error} If there's an error fetching or processing the delegates data
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
      console.error('Error fetching SUMR decay factors:', error)

      return { sumrDelegates, sumrDecayFactors: [] }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching SUMR delegates:', error)

    return { sumrDelegates: [], sumrDecayFactors: [] }
  }
}
