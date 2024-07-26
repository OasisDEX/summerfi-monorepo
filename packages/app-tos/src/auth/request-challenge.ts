/**
 * Requests a challenge from the authentication server.
 *
 * @remarks
 * This method sends a POST request to the `/api/auth/challenge` endpoint with the provided wallet address and
 * Gnosis Safe status. It returns a challenge string on success or undefined if an error occurs.
 *
 * @param walletAddress - The wallet address to be used in the challenge request.
 * @param isGnosisSafe - A boolean indicating if the wallet is a Gnosis Safe.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 *
 * @returns A promise that resolves to the challenge string or undefined if an error occurs.
 */
export const requestChallenge = async ({
  walletAddress,
  isGnosisSafe,
  host = '',
}: {
  walletAddress: string
  isGnosisSafe: boolean
  host?: string
}): Promise<string | undefined> => {
  try {
    const { challenge } = await fetch(`${host}/api/auth/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: walletAddress.toLowerCase(), isGnosisSafe }),
    }).then((resp) => resp.json())

    return challenge
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Request challenge error', e)

    return undefined
  }
}
