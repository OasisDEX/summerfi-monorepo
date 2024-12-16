'use client'
import { useReducer } from 'react'
import { Card } from '@summerfi/app-earn-ui'

import { ClaimDelegateFormContent } from '@/features/claim-and-delegate/components/ClaimDelegateFormContent/ClaimDelegateFormContent'
import { ClaimDelegateFormHeader } from '@/features/claim-and-delegate/components/ClaimDelegateFormHeader/ClaimDelegateFormHeader'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'

import classNames from './ClaimDelegateForm.module.scss'

export const ClaimDelegateForm = () => {
  const [state, dispatch] = useReducer(claimDelegateReducer, claimDelegateState)

  return (
    <Card variant="cardSecondary" className={classNames.claimDelegateForm}>
      <ClaimDelegateFormHeader state={state} />
      <div className={classNames.separator} />
      <ClaimDelegateFormContent state={state} dispatch={dispatch} />
    </Card>
  )
}
