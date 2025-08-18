import { UiTransactionStatuses } from '@summerfi/app-types'

export const getDelegateOptInMerklButtonLabel = ({
  merklStatus,
}: {
  merklStatus?: UiTransactionStatuses
}) => {
  switch (merklStatus) {
    case UiTransactionStatuses.FAILED:
      return 'Try again'
    case UiTransactionStatuses.PENDING:
      return 'Approving...'
    case UiTransactionStatuses.COMPLETED:
      return 'Approved'
    default:
      return 'Approve'
  }
}
