import type { Dispatch, FC } from 'react'
import { SDKChainId } from '@summerfi/app-types'
import { useParams } from 'next/navigation'
import { base } from 'viem/chains'

import { ClaimDelegateStakeDelegateCompletedSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateCompletedSubstep/ClaimDelegateStakeDelegateCompletedSubstep'
import { ClaimDelegateStakeDelegateSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateSubstep/ClaimDelegateStakeDelegateSubstep'
import { useDecayFactor } from '@/features/claim-and-delegate/hooks/use-decay-factor'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { usePublicClient } from '@/hooks/use-public-client'
import { useTokenBalance } from '@/hooks/use-token-balance'

interface ClaimDelegateStakeDelegateStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateStakeDelegateStep: FC<ClaimDelegateStakeDelegateStepProps> = ({
  state,
  dispatch,
  externalData,
}) => {
  const { publicClient } = usePublicClient({ chain: base })
  const { walletAddress } = useParams()

  const sumrBalanceData = useTokenBalance({
    publicClient,
    vaultTokenSymbol: 'SUMMER',
    tokenSymbol: 'SUMMER',
    chainId: SDKChainId.BASE,
    overwriteWalletAddress: walletAddress as string,
  })

  const { decayFactor, isLoading } = useDecayFactor(state.delegatee)

  return (
    <>
      {state.stakingStatus !== ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
          sumrBalanceData={sumrBalanceData}
          decayFactor={decayFactor}
          decayFactorLoading={isLoading}
        />
      )}
      {state.stakingStatus === ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateCompletedSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
          sumrBalanceData={sumrBalanceData}
          decayFactor={decayFactor}
        />
      )}
    </>
  )
}
