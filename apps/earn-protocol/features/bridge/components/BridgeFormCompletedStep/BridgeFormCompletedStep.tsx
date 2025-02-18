import { type Dispatch, type FC } from 'react'
import { useChain } from '@account-kit/react'
import { Icon, Sidebar, Text } from '@summerfi/app-earn-ui'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'

import { NetworkBalances } from '@/features/bridge/components/NetworkBalances/NetworkBalances'
import { type BridgeReducerAction, type BridgeState } from '@/features/bridge/types'

import styles from './BridgeFormCompletedStep.module.scss'

interface BridgeFormCompletedStepProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
}

export const BridgeFormCompletedStep: FC<BridgeFormCompletedStepProps> = ({ state, dispatch }) => {
  const { chain: sourceChain } = useChain()

  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)
  const destinationNetwork = chainIdToSDKNetwork(state.destinationChain.id)
  const sourceHumanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)
  const destinationHumanNetworkName = sdkNetworkToHumanNetwork(destinationNetwork)

  if (!isSupportedHumanNetwork(sourceHumanNetworkName)) {
    throw new Error('Invalid source chain')
  }

  if (!isSupportedHumanNetwork(destinationHumanNetworkName)) {
    throw new Error('Invalid destination chain')
  }

  return (
    <Sidebar
      centered
      hiddenHeaderChevron
      title="Transaction confirmed"
      content={
        <div className={styles.contentWrapper}>
          <div className={styles.confirmationWrapper}>
            <Icon size={100} iconName="summer_illustration_check" />
            <Text variant="p2" as="p" className={styles.description}>
              Transaction complete!
            </Text>
          </div>
          <NetworkBalances
            sourceHumanNetworkName={sourceHumanNetworkName}
            destinationHumanNetworkName={destinationHumanNetworkName}
            amount={state.amount ?? '0'}
            sumrBalances={state.sumrBalances}
            destinationChainId={state.destinationChain.id}
          />
        </div>
      }
      primaryButton={{
        label: 'New trade',
        action: () => {
          dispatch({
            type: 'reset',
          })
        },
      }}
      secondaryButton={{
        label: (
          <>
            See details
            <Icon iconName="sign_out" size={20} color="var(--earn-protocol-secondary-100)" />
          </>
        ),
        target: '_blank',
        url: `https://layerzeroscan.com/tx/${state.transactionHash}`,
      }}
    />
  )
}
