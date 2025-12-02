'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import { DelegatePageView } from './DelegatePageView'

interface DelegatePageViewComponentProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const DelegatePageViewComponent: FC<DelegatePageViewComponentProps> = ({
  walletAddress,
  externalData,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <DelegatePageView walletAddress={walletAddress} externalData={externalData} />
    </SDKContextProvider>
  )
}
