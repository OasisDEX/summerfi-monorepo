import { type JWTChallenge } from '@summerfi/app-types'

import { type TOSMessageType } from '@/types'

import { getSignMessage } from './get-sign-message'

/**
 * Recreate the signed message from a given JWT challenge.
 *
 * @param challenge - The JWTChallenge object containing the address and randomChallenge.
 * @param type - The type of Terms of Service message to generate.
 * @returns A string message that should be signed to verify the wallet.
 *
 * @remarks
 * This function generates a message string that is used to verify a wallet by signing it.
 * The generated message format must match the one used by the frontend `getDataToSignFromChallenge` function.
 */
export function recreateSignedMessage(challenge: JWTChallenge, type: TOSMessageType): string {
  // This function needs to be in sync with frontend getDataToSignFromChallenge() function
  return getSignMessage(challenge, type)
}
