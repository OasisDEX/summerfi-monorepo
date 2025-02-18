import { type Dispatch, type FC, useCallback } from 'react'
import { useChain } from '@account-kit/react'
import { MessageStatus } from '@layerzerolabs/scan-client'
import { Icon, InfoBox, LoadingSpinner, Sidebar, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import clsx from 'clsx'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useCrossChainMessages } from '@/features/bridge/hooks/use-cross-chain-messages'
import { type BridgeReducerAction, type BridgeState, BridgeTxStatus } from '@/features/bridge/types'

import styles from './BridgeFormPendingStep.module.scss'
import { capitalize } from 'lodash-es'

interface BridgeFormPendingStepProps {
  dispatch: Dispatch<BridgeReducerAction>
  state: BridgeState
}

export const BridgeFormPendingStep: FC<BridgeFormPendingStepProps> = ({ state, dispatch }) => {
  const { chain: sourceChain } = useChain()

  const sourceNetwork = chainIdToSDKNetwork(sourceChain.id)
  const destinationNetwork = chainIdToSDKNetwork(state.destinationChain.id)
  const sourceHumanNetworkName = sdkNetworkToHumanNetwork(sourceNetwork)
  const destinationHumanNetworkName = sdkNetworkToHumanNetwork(destinationNetwork)

  const sourceNetworkIcon = networkIconByNetworkName[sourceNetwork]
  const destinationNetworkIcon = networkIconByNetworkName[destinationNetwork]

  if (!isSupportedHumanNetwork(sourceHumanNetworkName)) {
    throw new Error('Invalid source chain')
  }

  if (!isSupportedHumanNetwork(destinationHumanNetworkName)) {
    throw new Error('Invalid destination chain')
  }

  const handleSuccess = useCallback(() => {
    dispatch({
      type: 'update-bridge-status',
      payload: BridgeTxStatus.COMPLETED,
    })
  }, [dispatch])

  const { isLoading, error, latestStatus } = useCrossChainMessages({
    srcTxHash: state.transactionHash,
    onSuccess: handleSuccess,
  })

  const resolvedSecondaryButtonLabel =
    isLoading || !latestStatus ? (
      <>
        <LoadingSpinner size={28} />
        <span style={{ color: 'var(--color-text-primary)' }}>Loading details...</span>
      </>
    ) : latestStatus !== MessageStatus.INFLIGHT ? (
      <>
        <LoadingSpinner size={28} />
        <span style={{ color: 'var(--color-text-primary)' }}>Updating details...</span>
      </>
    ) : (
      <>
        See details
        <Icon iconName="sign_out" size={20} />
      </>
    )

  return (
    <Sidebar
      centered
      hiddenHeaderChevron
      title="Transaction is processing..."
      content={
        <div className={styles.contentWrapper}>
          <div className={styles.networkIconsWrapper}>
            <div className={styles.networkIcon}>
              <Icon iconName="sumr" size={18} className={styles.sumrIcon} />
              {sourceNetworkIcon && <Icon size={52} iconName={sourceNetworkIcon} />}
            </div>
            <div className={styles.joiner}></div>
            <div className={styles.networkIcon}>
              <Icon iconName="sumr" size={18} className={styles.sumrIcon} />
              {destinationNetworkIcon && <Icon size={52} iconName={destinationNetworkIcon} />}
            </div>
          </div>
          <div className={styles.infoBoxWrapper}>
            <InfoBox
              error={error?.message}
              rows={[
                {
                  label: 'Status',
                  value: (
                    <div
                      className={clsx(styles.status, {
                        [styles.error]: latestStatus === MessageStatus.FAILED,
                        [styles.pending]: latestStatus === MessageStatus.INFLIGHT,
                      })}
                    >
                      {latestStatus ? (
                        capitalize(latestStatus)
                      ) : (
                        <SkeletonLine width={100} height={20} />
                      )}
                    </div>
                  ),
                  type: 'entry',
                },
                {
                  type: 'separator',
                },
                {
                  label: 'Estimated wait',
                  value: '~2 mins',
                  type: 'entry',
                },
              ]}
            />
          </div>
        </div>
      }
      primaryButton={{
        label: 'Create new transaction',
        action: () => {
          dispatch({
            type: 'reset',
          })
        },
      }}
      secondaryButton={{
        label: resolvedSecondaryButtonLabel,
        target: '_blank',
        loading: isLoading || !latestStatus,
        url: `https://layerzeroscan.com/tx/${state.transactionHash}`,
      }}
      footnote={
        <div className={styles.footnote}>
          <Text variant="p4semi" as="p" className={styles.description}>
            Leaving this page won&apos;t cancel the trade
          </Text>
        </div>
      }
    />
  )
}
