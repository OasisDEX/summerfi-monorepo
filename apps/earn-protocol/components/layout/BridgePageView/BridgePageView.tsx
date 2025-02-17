'use client'
import { type FC, useReducer } from 'react'

import { BridgeForm } from '@/features/bridge/components/BridgeForm/BridgeForm'
import { bridgeReducer, bridgeState } from '@/features/bridge/state'
import { type BridgeExternalData } from '@/features/bridge/types'

import classNames from './BridgePageView.module.scss'

interface BridgePageViewProps {
  walletAddress: string
  externalData: BridgeExternalData
}

export const BridgePageView: FC<BridgePageViewProps> = ({ walletAddress, externalData }) => {
  const [state, dispatch] = useReducer(bridgeReducer, {
    ...bridgeState,
    walletAddress,
    sumrBalances: externalData.sumrBalances,
  })

  return (
    <div className={classNames.bridgePageWrapper}>
      <BridgeForm state={state} dispatch={dispatch} externalData={externalData} />
    </div>
  )
}
