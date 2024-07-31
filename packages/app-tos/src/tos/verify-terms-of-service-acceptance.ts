import { type TOSVerifyAcceptance } from '@/types'
/**
 * Verifies the acceptance of the terms of service for a given wallet address and version.
 *
 * @remarks
 * This method sends a GET request to the `/api/tos/{version}/{walletAddress}` endpoint to check if the user has accepted
 * the terms of service for the specified version. It returns an object indicating whether the terms were accepted,
 * whether they have been updated, and whether the user is authorized.
 *
 * @param walletAddress - The wallet address of the user whose acceptance status is being verified.
 * @param version - The version of the terms of service document.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 *
 * @returns A promise that resolves to an object with the following properties:
 * - `acceptance`: A boolean indicating if the terms of service were accepted.
 * - `updated`: An optional boolean indicating if the terms of service have been updated.
 * - `authorized`: An optional boolean indicating if the user is authorized.
 * @throws Will throw an error if the request fails.
 */

export const verifyTermsOfServiceAcceptance = async ({
  walletAddress,
  version,
  host = '',
}: {
  walletAddress: string
  version: string
  host?: string
}): Promise<TOSVerifyAcceptance | undefined> => {
  try {
    const { acceptance, updated, authorized }: TOSVerifyAcceptance = await fetch(
      `${host}/api/tos/${version}/${walletAddress}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    ).then((resp) => resp.json())

    return { acceptance, updated, authorized }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Terms of service verification request failed:', e)

    return undefined
  }
}
