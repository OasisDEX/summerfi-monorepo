import { type SendState, SendTxStatuses } from '@/features/send/types'

export const getSendPrimaryBtnLabel = ({ state }: { state: SendState }) => {
  if (state.txStatus === SendTxStatuses.PENDING) {
    return 'Sending...'
  }

  if (state.txStatus === SendTxStatuses.FAILED) {
    return 'Retry'
  }

  if (state.txStatus === SendTxStatuses.COMPLETED) {
    return 'Go back'
  }

  return 'Send'
}
