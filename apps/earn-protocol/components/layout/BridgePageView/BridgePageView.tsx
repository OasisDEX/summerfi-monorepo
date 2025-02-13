'use client'
import { type FC } from 'react'

import { BridgeForm } from '@/features/bridge/components/BridgeForm/BridgeForm'
import { type BridgeExternalData } from '@/features/bridge/types'

import classNames from './BridgePageView.module.scss'

interface BridgePageViewProps {
  walletAddress: string
  externalData: BridgeExternalData
}

export const BridgePageView: FC<BridgePageViewProps> = ({ walletAddress, externalData }) => {
  return (
    <div className={classNames.bridgePageWrapper}>
      <BridgeForm walletAddress={walletAddress} externalData={externalData} />
    </div>
  )
}
