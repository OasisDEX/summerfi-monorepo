'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type BridgeExternalData } from '@/features/bridge/types'

import { BridgePageView } from './BridgePageView'

interface BridgePageViewComponentProps {
  walletAddress: string
  externalData: BridgeExternalData
  sumrPriceUsd: number
}

export const BridgePageViewComponent: FC<BridgePageViewComponentProps> = ({
  walletAddress,
  externalData,
  sumrPriceUsd,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <BridgePageView
        walletAddress={walletAddress}
        externalData={externalData}
        sumrPriceUsd={sumrPriceUsd}
      />
    </SDKContextProvider>
  )
}
