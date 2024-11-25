import { type Dispatch } from 'react'

import { TransakAboutKycStep } from '@/features/transak/components/TransakAboutKycStep/TransakAboutKycStep'
import { TransakBuyEthStep } from '@/features/transak/components/TransakBuyEthStep/TransakBuyEthStep'
import { TransakExchange } from '@/features/transak/components/TransakExchange/TransakExchange'
import { TransakInitialStep } from '@/features/transak/components/TransakInitialStep/TransakInitialStep'
import { TransakOrderStep } from '@/features/transak/components/TransakOrderStep/TransakOrderStep'
import { TransakSwitchToL2Step } from '@/features/transak/components/TransakSwitchToL2Step/TransakSwitchToL2Step'
import {
  type TransakReducerAction,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

export const getTransakContent = ({
  dispatch,
  state,
  isMobile,
}: {
  dispatch: Dispatch<TransakReducerAction>
  state: TransakReducerState
  isMobile: boolean
}) => {
  switch (state.step) {
    case TransakSteps.INITIAL:
      return <TransakInitialStep />
    case TransakSteps.ABOUT_KYC:
      return <TransakAboutKycStep />
    case TransakSteps.BUY_ETH:
      return <TransakBuyEthStep />
    case TransakSteps.SWITCH_TO_L2:
      return <TransakSwitchToL2Step dispatch={dispatch} />
    case TransakSteps.EXCHANGE:
      return <TransakExchange dispatch={dispatch} state={state} />
    case TransakSteps.KYC:
      return (
        <div
          id="transak-dialog"
          style={{
            width: isMobile ? '100%' : '500px',
            height: '550px',
            margin: 'var(--general-space-16) auto',
            background: 'linear-gradient(rgb(52, 61, 75) 70%, rgb(49, 58, 71) 100%)',
            padding: 'var(--general-space-16)',
            borderRadius: 'var(--general-radius-8)',
          }}
        />
      )
    case TransakSteps.ORDER:
      return <TransakOrderStep orderData={state.orderData} />
    default:
      return `Unknown step: ${state.step}`
  }
}
