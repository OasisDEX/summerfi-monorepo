import { type JWTChallenge } from '@summerfi/app-types'

/**
 * Recreate the signed message from a given JWT challenge.
 *
 * @param challenge - The JWTChallenge object containing the address and randomChallenge.
 * @returns A string message that should be signed to verify the wallet.
 *
 * @remarks
 * This function generates a message string that is used to verify a wallet by signing it.
 * The generated message format must match the one used by the frontend `getDataToSignFromChallenge` function.
 */
export function recreateSignedMessage(challenge: JWTChallenge): string {
  // This function needs to be in sync with frontend getDataToSignFromChallenge() function
  return `Sign to verify your wallet ${challenge.address} (${challenge.randomChallenge})`
}
