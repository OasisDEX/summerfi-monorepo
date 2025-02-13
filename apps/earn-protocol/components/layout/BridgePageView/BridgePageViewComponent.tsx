'use client'
import { type FC } from 'react'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'
import { type BridgeExternalData } from '@/features/bridge/types'

import { BridgePageView } from './BridgePageView'

interface BridgePageViewComponentProps {
  walletAddress: string
  externalData: BridgeExternalData
}

export const BridgePageViewComponent: FC<BridgePageViewComponentProps> = ({
  walletAddress,
  externalData,
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <BridgePageView walletAddress={walletAddress} externalData={externalData} />
    </SDKContextProvider>
  )
}
