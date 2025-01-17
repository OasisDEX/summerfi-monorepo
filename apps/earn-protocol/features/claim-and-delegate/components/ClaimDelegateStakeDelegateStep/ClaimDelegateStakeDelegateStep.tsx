import type { Dispatch, FC } from 'react'
import { SDKChainId } from '@summerfi/app-types'
import { base } from 'viem/chains'

import { ClaimDelegateStakeDelegateCompletedSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateCompletedSubstep/ClaimDelegateStakeDelegateCompletedSubstep'
import { ClaimDelegateStakeDelegateSubstep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/substeps/ClaimDelegateStakeDelegateSubstep/ClaimDelegateStakeDelegateSubstep'
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

  const sumrBalanceData = useTokenBalance({
    publicClient,
    vaultTokenSymbol: 'SUMMER',
    tokenSymbol: 'SUMMER',
    chainId: SDKChainId.BASE,
  })

  return (
    <>
      {state.delegateStatus !== ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
          sumrBalanceData={sumrBalanceData}
        />
      )}
      {state.delegateStatus === ClaimDelegateTxStatuses.COMPLETED && (
        <ClaimDelegateStakeDelegateCompletedSubstep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
          sumrBalanceData={sumrBalanceData}
        />
      )}
    </>
  )
}
