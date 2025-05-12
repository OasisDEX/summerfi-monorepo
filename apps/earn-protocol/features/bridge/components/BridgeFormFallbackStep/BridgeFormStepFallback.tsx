import { type Dispatch, type FC } from 'react'
import { InfoBox, Sidebar, Text } from '@summerfi/app-earn-ui'
import { redirect, useSearchParams } from 'next/navigation'

import { type BridgeReducerAction, type BridgeState } from '@/features/bridge/types'

import styles from './BridgeFormStepFallback.module.css'

interface BridgeFormStepFallbackProps {
  state: BridgeState
  dispatch: Dispatch<BridgeReducerAction>
  error: string | undefined
}

export const BridgeFormStepFallback: FC<BridgeFormStepFallbackProps> = ({
  dispatch,
  state,
  error,
}) => {
  const searchParams = useSearchParams()
  const viaParam = searchParams.get('via')

  const { walletAddress } = state

  const secondaryButtonConfig = {
    claim: {
      label: 'Back to claim',
      action: () => {
        redirect(`/earn/claim/${walletAddress}?via=claim`)
      },
    },
    portfolio: {
      label: 'Back to portfolio',
      action: () => {
        redirect(`/earn/portfolio/${walletAddress}?via=portfolio`)
      },
    },
  }

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
      secondaryButton={
        walletAddress && viaParam && (viaParam === 'claim' || viaParam === 'portfolio')
          ? secondaryButtonConfig[viaParam]
          : undefined
      }
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
