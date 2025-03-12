import { type SendState, SendTxStatuses } from '@/features/send/types'

export const getSendSidebarTitle = ({ state }: { state: SendState }) => {
  if (state.txStatus === SendTxStatuses.PENDING) {
    return 'Transaction processing...'
  }

  if (state.txStatus === SendTxStatuses.COMPLETED) {
    return 'Transaction complete!'
  }

  return 'Send'
}
