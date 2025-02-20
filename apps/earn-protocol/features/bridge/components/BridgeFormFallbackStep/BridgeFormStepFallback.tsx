import { type Dispatch, type FC } from 'react'
import { InfoBox, Sidebar, Text } from '@summerfi/app-earn-ui'

import { type BridgeReducerAction } from '@/features/bridge/types'

import styles from './BridgeFormStepFallback.module.scss'

interface BridgeFormStepFallbackProps {
  dispatch: Dispatch<BridgeReducerAction>
  error: string | undefined
}

export const BridgeFormStepFallback: FC<BridgeFormStepFallbackProps> = ({ dispatch, error }) => {
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
                  value: <div className={styles.error}>Failed</div>,
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
