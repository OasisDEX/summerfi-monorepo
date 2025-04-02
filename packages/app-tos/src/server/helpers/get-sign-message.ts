import { type JWTChallenge } from '@summerfi/app-types'

import { type TOSMessageType } from '@/types'

export const getSignMessage = (challenge: JWTChallenge, type: TOSMessageType): string => {
  return {
    default: `Sign to verify your wallet ${challenge.address} (${challenge.randomChallenge}) and accept the Summer.fi Terms of Service.`,
    sumrAirdrop: `I, owner of wallet address ${challenge.address} (${challenge.randomChallenge}), sign this message to confirm that I have read and accepted the $SUMR Token Airdrop Terms and Conditions`,
  }[type]
}
