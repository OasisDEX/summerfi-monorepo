'use client'
import { type Dispatch, type FC } from 'react'
import { Card } from '@summerfi/app-earn-ui'

import { ClaimDelegateFormContent } from '@/features/claim-and-delegate/components/ClaimDelegateFormContent/ClaimDelegateFormContent'
import { ClaimDelegateFormHeader } from '@/features/claim-and-delegate/components/ClaimDelegateFormHeader/ClaimDelegateFormHeader'
import type {
  ClaimDelegateReducerAction,
  ClaimDelegateState,
  ClamDelegateExternalData,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateForm.module.scss'

interface ClaimDelegateFormProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClamDelegateExternalData
}

export const ClaimDelegateForm: FC<ClaimDelegateFormProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  return (
    <Card variant="cardSecondary" className={classNames.claimDelegateForm}>
      <ClaimDelegateFormHeader state={state} />
      <div className={classNames.separator} />
      <ClaimDelegateFormContent state={state} dispatch={dispatch} externalData={externalData} />
    </Card>
  )
}