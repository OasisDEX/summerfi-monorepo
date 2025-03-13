import { humanReadableChainToLabelMap } from '@summerfi/app-utils'

import { type SendState, SendTxStatuses } from '@/features/send/types'

export const getSendPrimaryBtnLabel = ({
  state,
  isCorrectChain,
}: {
  state: SendState
  isCorrectChain: boolean
}) => {
  if (!isCorrectChain) {
    return `Switch network to ${humanReadableChainToLabelMap[state.tokenDropdown.chainId]}`
  }

  if (state.txStatus === SendTxStatuses.PENDING) {
    return 'Sending...'
  }

  if (state.txStatus === SendTxStatuses.FAILED) {
    return 'Retry'
  }

  if (state.txStatus === SendTxStatuses.COMPLETED) {
    return 'Go to my portfolio'
  }

  return 'Send'
}
