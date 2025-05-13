import { type Dispatch, type FC, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { ClaimDelegateAcceptanceStep } from '@/features/claim-and-delegate/components/ClaimDelegateAcceptanceStep/ClaimDelegateAcceptanceStep'
import { ClaimDelegateClaimStep } from '@/features/claim-and-delegate/components/ClaimDelegateClaimStep/ClaimDelegateClaimStep'
import { ClaimDelegateCompletedStep } from '@/features/claim-and-delegate/components/ClaimDelegateCompletedStep/ClaimDelegateCompletedStep'
import { ClaimDelegateStakeStep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeStep/ClaimDelegateStakeStep'
import { ClaimDelegateStep } from '@/features/claim-and-delegate/components/ClaimDelegateStep/ClaimDelegateStep'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateFormContent.module.css'

interface ClaimDelegateFormContentProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateFormContent: FC<ClaimDelegateFormContentProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const searchParams = useSearchParams()
  const via = searchParams.get('via')

  // Handle direct navigation to CLAIM step when returning from bridge
  useEffect(() => {
    if (via === 'bridge' && state.step === ClaimDelegateSteps.TERMS) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.CLAIM })
    }
  }, [via, state.step, dispatch])

  return (
    <div className={classNames.claimDelegateFormContentWrapper}>
      {state.step === ClaimDelegateSteps.TERMS && (
        <ClaimDelegateAcceptanceStep state={state} dispatch={dispatch} />
      )}
      {state.step === ClaimDelegateSteps.CLAIM && (
        <ClaimDelegateClaimStep state={state} dispatch={dispatch} externalData={externalData} />
      )}
      {state.step === ClaimDelegateSteps.DELEGATE && (
        <ClaimDelegateStep state={state} dispatch={dispatch} externalData={externalData} />
      )}
      {state.step === ClaimDelegateSteps.STAKE && (
        <ClaimDelegateStakeStep state={state} dispatch={dispatch} externalData={externalData} />
      )}
      {state.step === ClaimDelegateSteps.COMPLETED && (
        <ClaimDelegateCompletedStep state={state} externalData={externalData} />
      )}
    </div>
  )
}
