import { UiTransactionStatuses } from '@summerfi/app-types'

import { type BeachClubState } from '@/features/beach-club/types'

export const getBeachClubClaimFeesButtonLabel = ({ state }: { state: BeachClubState }) => {
  switch (state.claimStatus) {
    case UiTransactionStatuses.PENDING:
      return 'Claiming...'
    case UiTransactionStatuses.COMPLETED:
      return 'Claimed'
    case UiTransactionStatuses.FAILED:
      return 'Retry'
    default:
      return 'Claim Fees'
  }
}
