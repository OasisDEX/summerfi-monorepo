import { type Dispatch, type ReactElement } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import { TransakFootNoteLink } from '@/features/transak/components/TransakFootNoteLink/TransakFootNoteLink'
import {
  TransakOrderDataStatus,
  type TransakReducerAction,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

const defaultLink = {
  link: 'https://transak.com/',
  label: 'Learn more about KYC',
}

/**
 * Generates the Transak footnote component based on the current state and dispatch function.
 *
 * @param {Object} params - The parameters for generating the Transak footnote.
 * @param {TransakReducerState} params.state - The current state of the Transak reducer.
 * @param {Dispatch<TransakReducerAction>} params.dispatch - The dispatch function for the Transak reducer.
 * @returns {ReactElement} - The generated Transak footnote component.
 */
export const getTransakFootnote = ({
  state,
  dispatch,
}: {
  state: TransakReducerState
  dispatch: Dispatch<TransakReducerAction>
}): ReactElement => {
  switch (state.step) {
    case TransakSteps.ORDER: {
      const isOrderCompleted = state.orderData?.data.status === TransakOrderDataStatus.COMPLETED
      const transactionLink = state.orderData?.data.transactionLink

      const resolvedLabel = isOrderCompleted ? 'View on Etherscan' : defaultLink.label
      const resolvedLink = isOrderCompleted && transactionLink ? transactionLink : defaultLink.link

      return <TransakFootNoteLink label={resolvedLabel} href={resolvedLink} />
    }
    case TransakSteps.SWITCH_TO_L2:
      return <TransakFootNoteLink label="What is Layer 2?" href="/" withArrow={false} />
    case TransakSteps.BUY_ETH:
      return (
        <Text
          as="p"
          variant="p3semi"
          style={{ color: 'var(--earn-protocol-primary-100)', cursor: 'pointer' }}
          onClick={() => dispatch({ type: 'update-step', payload: TransakSteps.EXCHANGE })}
        >
          I already have ETH
        </Text>
      )
    default:
      return <TransakFootNoteLink label={defaultLink.label} href={defaultLink.link} />
  }
}
