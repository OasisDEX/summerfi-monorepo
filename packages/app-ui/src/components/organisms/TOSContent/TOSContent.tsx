import type { FC } from 'react'
import { type TOSState, TOSStatus } from '@summerfi/app-types'

import { TOSRetry } from '@/components/organisms/TOSRetry/TOSRetry'
import { TOSWaitingForAcceptance } from '@/components/organisms/TOSWaitingForAcceptance/TOSWaitingForAcceptance'
import { TOSWaitingForSignature } from '@/components/organisms/TOSWaitingForSignature/TOSWaitingForSignature'

interface TOSContentProps {
  tosState: TOSState
  documentLink: string
  handleToggle: () => void
  toggle: boolean
}

export const TOSContent: FC<TOSContentProps> = ({
  tosState,
  documentLink,
  handleToggle,
  toggle,
}) => {
  switch (tosState.status) {
    case TOSStatus.INIT:
    case TOSStatus.DONE:
      return null
    case TOSStatus.WAITING_FOR_SIGNATURE:
      return <TOSWaitingForSignature />
    case TOSStatus.WAITING_FOR_ACCEPTANCE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED:
      return (
        <TOSWaitingForAcceptance
          tosState={tosState}
          documentLink={documentLink}
          handleToggle={handleToggle}
          toggle={toggle}
        />
      )
    case TOSStatus.LOADING:
      return <TOSWaitingForSignature />
    case TOSStatus.RETRY:
      return <TOSRetry tosState={tosState} />
    default:
      return null
  }
}
