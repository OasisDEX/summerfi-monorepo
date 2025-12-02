'use client'
import { type Dispatch, type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'

import { ClaimDelegateFormContent } from '@/features/claim-and-delegate/components/ClaimDelegateFormContent/ClaimDelegateFormContent'
import { ClaimDelegateFormHeader } from '@/features/claim-and-delegate/components/ClaimDelegateFormHeader/ClaimDelegateFormHeader'
import type {
  ClaimDelegateExternalData,
  ClaimDelegateReducerAction,
  ClaimDelegateState,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateForm.module.css'

interface ClaimDelegateFormProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  stakingV2Enabled?: boolean
}

export const ClaimDelegateForm: FC<ClaimDelegateFormProps> = ({
  state,
  dispatch,
  externalData,
  stakingV2Enabled,
}) => {
  return (
    <Card variant="cardSecondary" className={classNames.claimDelegateForm}>
      <ClaimDelegateFormHeader state={state} isJustClaim={stakingV2Enabled} />
      <div className={classNames.separator} />
      <ClaimDelegateFormContent
        state={state}
        dispatch={dispatch}
        externalData={externalData}
        isJustClaim={stakingV2Enabled}
      />
    </Card>
  )
}
