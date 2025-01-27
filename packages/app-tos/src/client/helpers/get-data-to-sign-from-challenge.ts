import { type JWTChallenge } from '@summerfi/app-types'
import { decode } from 'jsonwebtoken'

import { getSignMessage } from '@/server/helpers/get-sign-message'
import { type TOSMessageType } from '@/types'

/**
 * Generates a data string to sign from a given challenge.
 *
 * @remarks
 * This method decodes a JWT challenge string and constructs a message
 * containing the address and a random challenge from the decoded payload.
 *
 * @param challenge - The JWT challenge string to decode.
 * @param type - The type of Terms of Service message to generate.
 *
 * @returns A string message containing the address and random challenge from the decoded payload.
 */
export const getDataToSignFromChallenge = (challenge: string, type: TOSMessageType): string => {
  const decodedChallenge = decode(challenge) as JWTChallenge

  return getSignMessage(decodedChallenge, type)
}
