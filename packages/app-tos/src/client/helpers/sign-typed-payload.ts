import { getDataToSignFromChallenge } from '@/client/helpers/get-data-to-sign-from-challenge'
import type { TOSSignMessage } from '@/types'

/**
 * Signs a typed payload based on a challenge string, a signing function, and an account address.
 *
 * @param challenge - The challenge string that needs to be signed
 * @param signMessage - A signer function that takes data, and returns a signed message
 *
 * @returns A promise that resolves to the signed message
 *
 */
export const signTypedPayload = (
  challenge: string,
  signMessage: TOSSignMessage,
): ReturnType<TOSSignMessage> => {
  const data = getDataToSignFromChallenge(challenge)

  return signMessage(data)
}
