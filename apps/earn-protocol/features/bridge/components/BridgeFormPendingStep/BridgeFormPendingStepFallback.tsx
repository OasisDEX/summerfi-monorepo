import { type Dispatch, type FC } from 'react'
import { InfoBox, Sidebar, Text } from '@summerfi/app-earn-ui'

import { type BridgeReducerAction } from '@/features/bridge/types'

import styles from './BridgeFormPendingStep.module.scss'

interface BridgeFormPendingStepFallbackProps {
  dispatch: Dispatch<BridgeReducerAction>
  error: string
}

export const BridgeFormPendingStepFallback: FC<BridgeFormPendingStepFallbackProps> = ({
  dispatch,
  error,
}) => {
  return (
    <Sidebar
      centered
      hiddenHeaderChevron
      title="Transaction error"
      content={
        <div className={styles.contentWrapper}>
          <div className={styles.infoBoxWrapper}>
            <InfoBox
              error={error}
              rows={[
                {
                  label: 'Status',
                  value: (
                    <div className={styles.error}>Our app detected an unsupported network.</div>
                  ),
                  type: 'entry',
                },
              ]}
            />
          </div>
        </div>
      }
      primaryButton={{
        label: 'Try again',
        action: () => {
          dispatch({
            type: 'reset',
          })
        },
      }}
      footnote={
        <div className={styles.footnote}>
          <Text variant="p4semi" as="p" className={styles.description}>
            Your transaction may still be inflight. Please try again with a supported network.
          </Text>
        </div>
      }
    />
  )
}
