import { getDataToSignFromChallenge } from '@/helpers/get-data-to-sign-from-challenge'
import type { TOSSignMessage } from '@/types'

/**
 * Signs a typed payload based on a challenge string, a signing function, and an account address.
 *
 * @param challenge - The challenge string that needs to be signed
 * @param signMessage - A function that takes data and an account, and returns a signed message
 * @param account - The account address to sign the data with
 *
 * @returns A promise that resolves to the signed message
 *
 */
export const signTypedPayload = (
  challenge: string,
  signMessage: TOSSignMessage,
  account: string,
): ReturnType<TOSSignMessage> => {
  const data = getDataToSignFromChallenge(challenge)

  return signMessage(data, account)
}
