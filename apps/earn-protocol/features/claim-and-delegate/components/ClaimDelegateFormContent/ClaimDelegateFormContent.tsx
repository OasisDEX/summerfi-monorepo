import { type Dispatch, type FC } from 'react'

import { ClaimDelegateAcceptanceStep } from '@/features/claim-and-delegate/components/ClaimDelegateAcceptanceStep/ClaimDelegateAcceptanceStep'
import { ClaimDelegateClaimStep } from '@/features/claim-and-delegate/components/ClaimDelegateClaimStep/ClaimDelegateClaimStep'
import { ClaimDelegateStakeDelegateStep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/ClaimDelegateStakeDelegateStep'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateFormContent.module.scss'

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
  return (
    <div className={classNames.claimDelegateFormContentWrapper}>
      {state.step === ClaimDelegateSteps.TERMS && (
        <ClaimDelegateAcceptanceStep state={state} dispatch={dispatch} />
      )}
      {state.step === ClaimDelegateSteps.CLAIM && (
        <ClaimDelegateClaimStep state={state} dispatch={dispatch} externalData={externalData} />
      )}{' '}
      {state.step === ClaimDelegateSteps.DELEGATE && (
        <ClaimDelegateStakeDelegateStep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
        />
      )}
    </div>
  )
}
