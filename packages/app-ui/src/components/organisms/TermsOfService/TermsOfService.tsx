'use client'
import { type FC, useCallback, useState } from 'react'
import { type TOSState } from '@summerfi/app-types'

import { TOSButtons } from '@/components/organisms/TOSButtons/TOSButtons'
import { TOSContent } from '@/components/organisms/TOSContent/TOSContent'

import termsOfServiceStyles from '@/components/organisms/TermsOfService/TermsOfService.module.css'

interface TermsOfServiceProps {
  tosState: TOSState
  documentLink: string
  disconnect: () => void
}

export const TermsOfService: FC<TermsOfServiceProps> = ({ tosState, disconnect, documentLink }) => {
  const [toggle, setToggle] = useState(false)

  const handleToggle = useCallback(() => setToggle((prev) => !prev), [])

  return (
    <div className={termsOfServiceStyles.termsOfServiceWrapper}>
      <TOSContent
        tosState={tosState}
        toggle={toggle}
        handleToggle={handleToggle}
        documentLink={documentLink}
      />
      <TOSButtons tosState={tosState} disconnect={disconnect} toggle={toggle} />
    </div>
  )
}
