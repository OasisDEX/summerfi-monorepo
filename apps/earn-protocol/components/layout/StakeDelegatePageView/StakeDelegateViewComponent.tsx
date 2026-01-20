'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import { StakeDelegatePageView } from './StakeDelegatePageView'

interface StakeDelegateViewComponentProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
  sumrPriceUsd: number
}

export const StakeDelegateViewComponent: FC<StakeDelegateViewComponentProps> = ({
  walletAddress,
  externalData,
  sumrPriceUsd,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <StakeDelegatePageView
        walletAddress={walletAddress}
        externalData={externalData}
        sumrPriceUsd={sumrPriceUsd}
      />
    </SDKContextProvider>
  )
}
