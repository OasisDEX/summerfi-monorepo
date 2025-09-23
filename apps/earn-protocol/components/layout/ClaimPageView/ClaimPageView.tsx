/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
'use client'
import { type FC, useReducer } from 'react'
import { SupportedNetworkIds } from '@summerfi/app-types'
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
    claimableBalances: Object.values(SupportedNetworkIds)
      .filter((networkId): networkId is number => typeof networkId === 'number')
      .reduce<ClaimableBalances>((acc, chainId) => {
        const numericChainId = chainId as SupportedNetworkIds

        const baseAdditionalRewards =
          numericChainId === SupportedNetworkIds.Base
            ? Number(externalData.sumrToClaim.voteRewards + externalData.sumrToClaim.merklRewards)
            : 0

        acc[numericChainId] =
          Number(
            externalData.sumrToClaim.aggregatedRewards.perChain[numericChainId] +
              baseAdditionalRewards,
          ) || 0

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
    merklIsAuthorizedPerChain: externalData.sumrToClaim.merklIsAuthorizedPerChain,
  })

  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader state={state} />
      <ClaimDelegateForm state={state} dispatch={dispatch} externalData={externalData} />
    </div>
  )
}
