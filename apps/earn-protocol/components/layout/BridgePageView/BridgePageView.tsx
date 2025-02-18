'use client'
import { type FC, useReducer } from 'react'

import { BridgeFormContent } from '@/features/bridge/components/BridgeFormContent/BridgeFormContent'
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
      <BridgeFormContent state={state} dispatch={dispatch} />
    </div>
  )
}
