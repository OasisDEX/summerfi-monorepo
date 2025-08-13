import { ClaimDelegateTxStatuses } from '@/features/claim-and-delegate/types'

export const getDelegateOptInMerklButtonLabel = ({
  merklStatus,
}: {
  merklStatus?: ClaimDelegateTxStatuses
}) => {
  switch (merklStatus) {
    case ClaimDelegateTxStatuses.FAILED:
      return 'Try again'
    case ClaimDelegateTxStatuses.PENDING:
      return 'Approving...'
    case ClaimDelegateTxStatuses.COMPLETED:
      return 'Approved'
    default:
      return 'Approve'
  }
}
