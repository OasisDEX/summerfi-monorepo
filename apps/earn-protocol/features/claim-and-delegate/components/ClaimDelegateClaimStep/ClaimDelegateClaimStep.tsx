import { type Dispatch, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { Button, SUMR_CAP, Text, useLocalConfig, WithArrow } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { useClaimSumrTransaction } from '@/features/claim-and-delegate/hooks/use-claim-sumr-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { ERROR_TOAST_CONFIG, SUCCESS_TOAST_CONFIG } from '@/features/toastify/config'
import { useClientChainId } from '@/hooks/use-client-chain-id'
import { useRiskVerification } from '@/hooks/use-risk-verification'
import { useUserWallet } from '@/hooks/use-user-wallet'

import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

import classNames from './ClaimDelegateClaimStep.module.scss'

const delayPerNetwork = {
  [SDKChainId.BASE]: 4000,
  [SDKChainId.ARBITRUM]: 4000,
  [SDKChainId.MAINNET]: 13000,
}

const claimItems: {
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
}[] = [
  {
    chainId: SDKChainId.BASE,
  },
  {
    chainId: SDKChainId.ARBITRUM,
  },
  {
    chainId: SDKChainId.MAINNET,
  },
]

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
  const { userWalletAddress } = useUserWallet()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const [claimOnChainId, setClaimOnChainId] = useState<
    SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  >(SDKChainId.BASE)

  const { claimSumrTransaction } = useClaimSumrTransaction({
    onSuccess: () => {
      // delay complete status to make sure that in the next step
      // when fetching sumr balance, it will be updated
      setTimeout(() => {
        dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.COMPLETED })

        toast.success('Claimed SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      }, delayPerNetwork[claimOnChainId])
    },
    onError: () => {
      dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.FAILED })

      toast.error('Failed to claim SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const handleAccept = async () => {
    if (state.claimStatus === ClaimDelegateTxStatuses.COMPLETED) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })

      return
    }

    if (clientChainId !== claimOnChainId) {
      setChain({ chain: SDKChainIdToAAChainMap[claimOnChainId] })

      return
    }

    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.PENDING })

    const risk = await checkRisk()

    if (risk.isRisky) {
      return
    }

    await claimSumrTransaction().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error claiming SUMR:', err)
    })
  }

  const sumrToClaim =
    externalData.sumrToClaim.claimableAggregatedRewards.perChain[claimOnChainId] ?? 0

  const hideButtonArrow = state.claimStatus === ClaimDelegateTxStatuses.PENDING

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {claimItems.map((item) => (
        <ClaimDelegateToClaim
          key={item.chainId}
          {...item}
          earned={formatCryptoBalance(
            externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
          )}
          earnedInUSD={formatFiatBalance(
            Number(
              externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
            ) * estimatedSumrPrice,
          )}
          isActive={claimOnChainId === item.chainId}
          onClick={() => setClaimOnChainId(item.chainId)}
        />
      ))}
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
          disabled={
            state.claimStatus === ClaimDelegateTxStatuses.PENDING ||
            sumrToClaim === 0 ||
            userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase()
          }
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
            {state.claimStatus === ClaimDelegateTxStatuses.FAILED &&
              (claimOnChainId !== clientChainId ? 'Switch Network' : 'Retry')}
            {state.claimStatus === undefined &&
              (claimOnChainId !== clientChainId ? 'Switch Network' : 'Claim')}
          </WithArrow>
        </Button>
      </div>
    </div>
  )
}
