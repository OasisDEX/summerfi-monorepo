interface SaveTermsOfServiceAcceptance {
  docVersion?: string
}

/**
 * Saves the acceptance of the terms of service for a given wallet address.
 *
 * @remarks
 * This method sends a POST request to the `/api/tos` endpoint with the provided wallet address and document version.
 * It returns the document version of the accepted terms of service.
 *
 * @param walletAddress - The wallet address of the user accepting the terms of service.
 * @param version - The version of the terms of service document.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 *
 * @returns A promise that resolves to an object containing the document version of the accepted terms of service.
 * @throws Will throw an error if the request fails.
 */
export const saveTermsOfServiceAcceptance = async ({
  walletAddress,
  version,
  host = '',
}: {
  walletAddress: string
  version: string
  host?: string
}): Promise<SaveTermsOfServiceAcceptance> => {
  const { docVersion }: SaveTermsOfServiceAcceptance = await fetch(`${host}/api/tos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docVersion: version,
      walletAddress: walletAddress.toLowerCase(),
    }),
    credentials: 'include',
  }).then((resp) => resp.json())

  return { docVersion }
}
