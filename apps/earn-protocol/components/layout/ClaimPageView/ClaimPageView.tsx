import { type FC } from 'react'

import { ClaimDelegateForm } from '@/features/claim-and-delegate/components/ClaimDelegateForm/ClaimDelegateForm'
import { ClaimDelegateHeader } from '@/features/claim-and-delegate/components/ClaimDelegateHeader/ClaimDelegateHeader'

import classNames from './ClaimPageView.module.scss'

interface ClaimPageViewProps {}

export const ClaimPageView: FC<ClaimPageViewProps> = () => {
  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader />
      <ClaimDelegateForm />
    </div>
  )
}
