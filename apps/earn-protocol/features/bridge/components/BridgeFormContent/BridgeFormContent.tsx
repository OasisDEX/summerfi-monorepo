import { type Dispatch, type FC } from 'react'

import { BridgeFormCompletedStep } from '@/features/bridge/components/BridgeFormCompletedStep/BridgeFormCompletedStep'
import { BridgeFormStepFallback } from '@/features/bridge/components/BridgeFormFallbackStep/BridgeFormStepFallback'
import { BridgeFormPendingStep } from '@/features/bridge/components/BridgeFormPendingStep/BridgeFormPendingStep'
import { BridgeFormStartStep } from '@/features/bridge/components/BridgeFormStartStep/BridgeFormStartStep'
import { CrossChainProviderNotice } from '@/features/bridge/components/CrossChainProviderNotice/CrossChainProviderNotice'
import { type BridgeReducerAction, type BridgeState, BridgeTxStatus } from '@/features/bridge/types'

interface BridgeFormContentProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
  sumrPriceUsd: number
}

export const BridgeFormContent: FC<BridgeFormContentProps> = ({
  state,
  dispatch,
  sumrPriceUsd,
}) => {
  return (
    <div>
      {state.bridgeStatus === BridgeTxStatus.NOT_STARTED && (
        <BridgeFormStartStep state={state} dispatch={dispatch} sumrPriceUsd={sumrPriceUsd} />
      )}
      {state.bridgeStatus === BridgeTxStatus.PENDING && (
        <BridgeFormPendingStep state={state} dispatch={dispatch} />
      )}
      {state.bridgeStatus === BridgeTxStatus.COMPLETED && (
        <BridgeFormCompletedStep state={state} dispatch={dispatch} />
      )}
      {state.bridgeStatus === BridgeTxStatus.FAILED && (
        <BridgeFormStepFallback state={state} dispatch={dispatch} error={state.error} />
      )}
      <CrossChainProviderNotice />
    </div>
  )
}
