'use client'
import { type FC, useReducer } from 'react'

import { ClaimDelegateForm } from '@/features/claim-and-delegate/components/ClaimDelegateForm/ClaimDelegateForm'
import { ClaimDelegateHeader } from '@/features/claim-and-delegate/components/ClaimDelegateHeader/ClaimDelegateHeader'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'

import classNames from './ClaimPageView.module.scss'

interface ClaimPageViewProps {
  walletAddress: string
}

export const ClaimPageView: FC<ClaimPageViewProps> = ({ walletAddress }) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    walletAddress,
  })

  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader state={state} />
      <ClaimDelegateForm state={state} dispatch={dispatch} />
    </div>
  )
}
