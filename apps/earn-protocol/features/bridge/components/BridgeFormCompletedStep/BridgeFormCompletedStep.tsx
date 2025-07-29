import { type Dispatch, type FC } from 'react'
import { useChain } from '@account-kit/react'
import { Icon, Sidebar, Text } from '@summerfi/app-earn-ui'
import { SupportedNetworkIds } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { useSearchParams } from 'next/navigation'

import { BridgeFormStepFallback } from '@/features/bridge/components/BridgeFormFallbackStep/BridgeFormStepFallback'
import { NetworkBalances } from '@/features/bridge/components/NetworkBalances/NetworkBalances'
import { type BridgeReducerAction, type BridgeState } from '@/features/bridge/types'

import styles from './BridgeFormCompletedStep.module.css'

interface BridgeFormCompletedStepProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
}

export const BridgeFormCompletedStep: FC<BridgeFormCompletedStepProps> = ({ state, dispatch }) => {
  const { chain: sourceChain } = useChain()
  const searchParams = useSearchParams()
  const viaParam = searchParams.get('via')
  const isViaPortfolio = viaParam === 'portfolio'
  const isViaClaim = viaParam === 'claim'

  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)
  const destinationNetwork = chainIdToSDKNetwork(state.destinationChain.id)
  const sourceHumanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)
  const destinationHumanNetworkName = sdkNetworkToHumanNetwork(destinationNetwork)

  if (!isSupportedHumanNetwork(sourceHumanNetworkName)) {
    const errorMessage = `Invalid source chain: ${sourceHumanNetworkName}`

    dispatch({
      type: 'error',
      payload: errorMessage,
    })

    return <BridgeFormStepFallback dispatch={dispatch} error={errorMessage} state={state} />
  }

  if (!isSupportedHumanNetwork(destinationHumanNetworkName)) {
    const errorMessage = `Invalid destination chain: ${destinationHumanNetworkName}`

    dispatch({
      type: 'error',
      payload: errorMessage,
    })

    return <BridgeFormStepFallback dispatch={dispatch} error={errorMessage} state={state} />
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
      primaryButton={
        isViaClaim
          ? {
              url: `/claim/${state.walletAddress}${
                state.destinationChain.id === SupportedNetworkIds.Base ? '?via=bridge' : ''
              }`,
              label: 'Return to claim',
            }
          : isViaPortfolio
            ? {
                url: `/portfolio/${state.walletAddress}`,
                label: 'Return to portfolio',
              }
            : {
                label: 'Create new transaction',
                action: () => {
                  dispatch({
                    type: 'reset',
                  })
                },
              }
      }
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
