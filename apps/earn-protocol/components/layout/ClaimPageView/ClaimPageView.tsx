/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
'use client'
import { type FC, useReducer } from 'react'
import { SDKChainId } from '@summerfi/app-types'
import { type HumanReadableNetwork, isSupportedHumanNetwork } from '@summerfi/app-utils'

import { ClaimDelegateForm } from '@/features/claim-and-delegate/components/ClaimDelegateForm/ClaimDelegateForm'
import { ClaimDelegateHeader } from '@/features/claim-and-delegate/components/ClaimDelegateHeader/ClaimDelegateHeader'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import {
  type ClaimableBalances,
  type ClaimDelegateExternalData,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimPageView.module.css'

interface ClaimPageViewProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const ClaimPageView: FC<ClaimPageViewProps> = ({ walletAddress, externalData }) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: externalData.sumrStakeDelegate.delegatedTo,
    walletAddress,
    claimableBalances: Object.values(SDKChainId)
      .filter((id) => typeof id === 'number')
      .reduce<ClaimableBalances>((acc, chainId) => {
        const numericChainId = chainId as SDKChainId

        acc[numericChainId] =
          externalData.sumrToClaim.claimableAggregatedRewards.perChain[numericChainId] || 0

        return acc
      }, {} as ClaimableBalances),
    walletBalances: Object.entries(externalData.sumrBalances).reduce(
      (acc, [humanReadableNetwork, balance]) => {
        if (isSupportedHumanNetwork(humanReadableNetwork)) {
          acc[humanReadableNetwork] = balance
        }

        return acc
      },
      {} as Record<HumanReadableNetwork, number>,
    ),
  })

  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader state={state} />
      <ClaimDelegateForm state={state} dispatch={dispatch} externalData={externalData} />
    </div>
  )
}
