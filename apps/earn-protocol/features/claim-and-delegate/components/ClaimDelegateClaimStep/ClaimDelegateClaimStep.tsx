import type { Dispatch, FC } from 'react'
import { useChain } from '@account-kit/react'
import {
  Button,
  Card,
  Icon,
  SUMR_CAP,
  Text,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { useClientChainId } from '@/hooks/use-client-chain-id'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateClaimStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateClaimStep: FC<ClaimDelegateClaimStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const handleAccept = () => {
    // claiming is only supported on base
    if (clientChainId !== SDKChainId.BASE) {
      // eslint-disable-next-line no-console
      console.log('update network to base')
      setChain({ chain: SDKChainIdToAAChainMap[SDKChainId.BASE] })
    }

    // TODO: Implement claim
    // eslint-disable-next-line no-console
    console.log('claim clicked')

    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.COMPLETED })

    if (state.claimStatus === ClaimDelegateTxStatuses.COMPLETED) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
    }
  }

  const earned = formatCryptoBalance(externalData.sumrEarned)
  const earnedInUSD = formatFiatBalance(Number(externalData.sumrEarned) * estimatedSumrPrice)

  const hideButtonArrow = state.claimStatus === ClaimDelegateTxStatuses.PENDING

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <Card className={classNames.cardWrapper}>
        <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          You have earned
        </Text>
        <div className={classNames.valueWithIcon}>
          <Icon tokenName="SUMR" />
          <Text as="h2" variant="h2">
            {earned}
          </Text>
        </div>
        <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          ${earnedInUSD}
        </Text>
      </Card>
      <div className={classNames.footerWrapper}>
        <Button variant="secondarySmall" onClick={handleBack}>
          <Text variant="p3semi" as="p">
            Back
          </Text>
        </Button>
        <Button
          variant="primarySmall"
          style={{
            paddingRight: hideButtonArrow ? 'var(--general-space-24)' : 'var(--general-space-32)',
          }}
          onClick={handleAccept}
          disabled={state.claimStatus === ClaimDelegateTxStatuses.PENDING}
        >
          <WithArrow
            style={{ color: 'var(--earn-protocol-secondary-100)' }}
            variant="p3semi"
            as="p"
            hideArrow={hideButtonArrow}
            isLoading={state.claimStatus === ClaimDelegateTxStatuses.PENDING}
          >
            {state.claimStatus === ClaimDelegateTxStatuses.PENDING && 'Claiming...'}
            {state.claimStatus === ClaimDelegateTxStatuses.COMPLETED && 'Continue'}
            {state.claimStatus === ClaimDelegateTxStatuses.FAILED && 'Retry'}
            {state.claimStatus === undefined && 'Claim'}
          </WithArrow>
        </Button>
      </div>
    </div>
  )
}
