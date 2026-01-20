'use client'
import { type FC, useReducer } from 'react'

import { BridgeFormContent } from '@/features/bridge/components/BridgeFormContent/BridgeFormContent'
import { bridgeReducer, bridgeState } from '@/features/bridge/state'
import { type BridgeExternalData } from '@/features/bridge/types'

import classNames from './BridgePageView.module.css'

interface BridgePageViewProps {
  externalData: BridgeExternalData
  walletAddress: string
  sumrPriceUsd: number
}

export const BridgePageView: FC<BridgePageViewProps> = ({
  walletAddress,
  externalData,
  sumrPriceUsd,
}) => {
  const [state, dispatch] = useReducer(bridgeReducer, {
    ...bridgeState,
    walletAddress,
    sumrBalances: externalData.sumrBalances,
  })

  return (
    <div className={classNames.bridgePageWrapper}>
      <BridgeFormContent state={state} dispatch={dispatch} sumrPriceUsd={sumrPriceUsd} />
    </div>
  )
}
