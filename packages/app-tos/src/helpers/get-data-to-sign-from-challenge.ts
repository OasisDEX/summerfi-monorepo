import { decode, type JwtPayload } from 'jsonwebtoken'

/**
 * Generates a data string to sign from a given challenge.
 *
 * @remarks
 * This method decodes a JWT challenge string and constructs a message
 * containing the address and a random challenge from the decoded payload.
 *
 * @param challenge - The JWT challenge string to decode.
 *
 * @returns A string message containing the address and random challenge from the decoded payload.
 */
export const getDataToSignFromChallenge = (challenge: string): string => {
  const decodedChallenge = decode(challenge) as JwtPayload

  return `Sign to verify your wallet ${decodedChallenge.address} (${decodedChallenge.randomChallenge})`
}
