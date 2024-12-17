import type { Dispatch, FC } from 'react'

import { ClaimDelegateStakeDelegateCompletedSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateCompletedSubstep/ClaimDelegateStakeDelegateCompletedSubstep'
import { ClaimDelegateStakeDelegateSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateSubstep/ClaimDelegateStakeDelegateSubstep'
import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
  type ClamDelegateExternalData,
} from '@/features/claim-and-delegate/types'

interface ClaimDelegateStakeDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClamDelegateExternalData
}

export const ClaimDelegateStakeDelegateStep: FC<ClaimDelegateStakeDelegateStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  return (
    <div>
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
    </div>
  )
}
