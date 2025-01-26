import {
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

import { ClaimDelegateAction } from './types'

export const getChangeDelegateButtonLabel = ({
  state,
  action,
  isBase,
}: {
  state: ClaimDelegateState
  action?: ClaimDelegateAction
  isBase: boolean
}) => {
  if (!isBase) {
    return 'Change network to Base'
  }

  if (action !== ClaimDelegateAction.CHANGE) {
    return 'Delegate'
  }

  if (state.delegateStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Delegating'
  }

  if (state.delegateStatus === ClaimDelegateTxStatuses.FAILED) {
    return 'Retry'
  }

  return 'Delegate'
}

export const getRemoveDelegateButtonLabel = ({
  state,
  action,
  isBase,
}: {
  state: ClaimDelegateState
  action?: ClaimDelegateAction
  isBase: boolean
}) => {
  if (!isBase) {
    return 'Change network to Base'
  }

  if (action !== ClaimDelegateAction.REMOVE) {
    return 'Remove delegation'
  }

  if (state.delegateStatus === ClaimDelegateTxStatuses.PENDING) {
    return 'Removing'
  }

  if (state.delegateStatus === ClaimDelegateTxStatuses.FAILED) {
    return 'Retry'
  }

  return 'Remove delegation'
}
