'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import { ClaimPageView } from './ClaimPageView'

interface ClaimPageViewComponentProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
  stakingV2Enabled?: boolean
}

export const ClaimPageViewComponent: FC<ClaimPageViewComponentProps> = ({
  walletAddress,
  externalData,
  stakingV2Enabled,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <ClaimPageView
        walletAddress={walletAddress}
        externalData={externalData}
        stakingV2Enabled={stakingV2Enabled}
      />
    </SDKContextProvider>
  )
}
