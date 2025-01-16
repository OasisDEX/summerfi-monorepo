'use client'
import { type FC, useReducer } from 'react'

import { ClaimDelegateForm } from '@/features/claim-and-delegate/components/ClaimDelegateForm/ClaimDelegateForm'
import { ClaimDelegateHeader } from '@/features/claim-and-delegate/components/ClaimDelegateHeader/ClaimDelegateHeader'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import classNames from './ClaimPageView.module.scss'

interface ClaimPageViewProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const ClaimPageView: FC<ClaimPageViewProps> = ({ walletAddress, externalData }) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: externalData.sumrStakeDelegate.delegatedTo,
    walletAddress,
  })

  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader state={state} />
      <ClaimDelegateForm state={state} dispatch={dispatch} externalData={externalData} />
    </div>
  )
}
