'use client'
import { type FC, useReducer } from 'react'
import { SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  type HumanReadableNetwork,
  isSupportedHumanNetwork,
  isSupportedSDKChain,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'

import { ClaimDelegateForm } from '@/features/claim-and-delegate/components/ClaimDelegateForm/ClaimDelegateForm'
import { ClaimDelegateHeader } from '@/features/claim-and-delegate/components/ClaimDelegateHeader/ClaimDelegateHeader'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import {
  type ClaimableBalances,
  type ClaimDelegateExternalData,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimPageView.module.scss'

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
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      }, {} as ClaimableBalances),
    walletBalances: Object.entries(externalData.sumrBalances).reduce<
      // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
      Record<HumanReadableNetwork, number>
    >((acc, [humanReadableNetwork, balance]) => {
      if (isSupportedHumanNetwork(humanReadableNetwork)) {
        acc[humanReadableNetwork] = balance
      }

      return acc
    }, {}),
  })

  return (
    <div className={classNames.claimPageWrapper}>
      <ClaimDelegateHeader state={state} />
      <ClaimDelegateForm state={state} dispatch={dispatch} externalData={externalData} />
    </div>
  )
}
