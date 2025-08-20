import { type useSmartAccountClient } from '@account-kit/react'
import { overridesGasSponsorship } from '@summerfi/app-earn-ui'

/**
 * Determines if gas sponsorship should be overridden based on eligibility check
 * @param smartAccountClient - Smart account client instance
 * @param txParams - Transaction parameters including target address, data and value
 * @returns Gas sponsorship override config if not eligible, undefined otherwise
 */
export const getGasSponsorshipOverride = async ({
  smartAccountClient,
  txParams,
}: {
  smartAccountClient: ReturnType<typeof useSmartAccountClient>['client']
  txParams: { target: `0x${string}`; data: `0x${string}`; value: bigint }
}) => {
  const eligibilityData = await smartAccountClient?.checkGasSponsorshipEligibility({
    uo: txParams,
  })

  return eligibilityData?.eligible === false ? overridesGasSponsorship : undefined
}
