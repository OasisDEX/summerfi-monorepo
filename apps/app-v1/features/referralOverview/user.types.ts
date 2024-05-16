import type { User } from '@summerfi/app-db'

export enum ClaimTxnState {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export type UserState = 'newUser' | 'currentUser' | 'walletConnectionInProgress'

export interface UserReferralState {
  user?: User
  claims?: boolean
  state: UserState
  referrer: string | null
  totalClaim?: string
  totalAmount?: string
  referrals?: string[]
  trigger: () => void
  invitePending?: boolean
  claimTxnState?: ClaimTxnState
  performClaimMultiple?: () => void
}
