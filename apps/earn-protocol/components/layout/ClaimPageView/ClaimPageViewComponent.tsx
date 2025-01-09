'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import { ClaimPageView } from './ClaimPageView'

interface ClaimPageViewComponentProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const ClaimPageViewComponent: FC<ClaimPageViewComponentProps> = ({
  walletAddress,
  externalData,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <ClaimPageView walletAddress={walletAddress} externalData={externalData} />
    </SDKContextProvider>
  )
}
