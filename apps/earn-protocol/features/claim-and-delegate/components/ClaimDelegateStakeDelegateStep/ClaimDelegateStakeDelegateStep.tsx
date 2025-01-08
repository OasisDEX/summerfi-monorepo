import type { Dispatch, FC } from 'react'

import { ClaimDelegateStakeDelegateCompletedSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateCompletedSubstep/ClaimDelegateStakeDelegateCompletedSubstep'
import { ClaimDelegateStakeDelegateSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateSubstep/ClaimDelegateStakeDelegateSubstep'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

interface ClaimDelegateStakeDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateStakeDelegateStep: FC<ClaimDelegateStakeDelegateStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  return (
    <>
      {state.delegateStatus !== ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
        />
      )}
      {state.delegateStatus === ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateCompletedSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
        />
      )}
    </>
  )
}
