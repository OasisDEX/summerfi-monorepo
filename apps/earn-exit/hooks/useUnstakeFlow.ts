'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Address, erc20Abi } from 'viem'
import { sendTransaction } from 'wagmi/actions'

import { getPublicClient } from '@/lib/clients'
import { type StakedSumrPosition, type SumrStake } from '@/lib/staking'
import { buildUnstakePlan, type UnstakeStep } from '@/lib/unstake-plan'
import { wagmiConfig } from '@/providers/Web3Provider'

export type StepStatus = 'pending' | 'in-progress' | 'done' | 'error'

export interface UnstakeRequest {
  position: StakedSumrPosition
  /** The stake to unstake, or `null` for a claim-only flow. */
  stake: SumrStake | null
  claimRewards: boolean
}

export const useUnstakeFlow = (request: UnstakeRequest | null, user?: Address) => {
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<UnstakeStep[]>([])
  const [statuses, setStatuses] = useState<StepStatus[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [executedAny, setExecutedAny] = useState(false)

  const position = request?.position ?? null
  const stake = request?.stake ?? null
  const claimRewards = request?.claimRewards ?? false

  // Build the plan whenever a request is opened.
  useEffect(() => {
    let cancelled = false

    setSteps([])
    setStatuses([])
    setErrorMessage(null)
    setExecutedAny(false)

    if (!request || !user) return undefined

    setLoading(true)

    const readAllowance = (): Promise<bigint> => {
      // Only an unstake needs the staked-token (stSUMR) allowance; a claim-only flow does not.
      if (!request.stake) return Promise.resolve(0n)

      return getPublicClient(request.position.chainId).readContract({
        address: request.position.stakedToken,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [user, request.position.stakingAddress],
      })
    }

    readAllowance()
      .then((stakedTokenAllowance) => {
        if (cancelled) return

        const plan = buildUnstakePlan({
          position: request.position,
          stake: request.stake,
          stakedTokenAllowance,
          claimRewards: request.claimRewards,
        })

        setSteps(plan)
        setStatuses(plan.map(() => 'pending'))
      })
      .catch((error: unknown) => {
        if (!cancelled) setErrorMessage(error instanceof Error ? error.message : String(error))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [request, user])

  const currentIndex = useMemo(() => statuses.findIndex((status) => status !== 'done'), [statuses])
  const resolvedIndex = currentIndex === -1 ? steps.length : currentIndex
  const allDone = steps.length > 0 && resolvedIndex === steps.length

  const executeCurrent = useCallback(async () => {
    if (!position || resolvedIndex >= steps.length) return

    const step = steps[resolvedIndex]

    setErrorMessage(null)
    setStatuses((previous) =>
      previous.map((status, index) => (index === resolvedIndex ? 'in-progress' : status)),
    )

    try {
      // See useExitFlow: the runtime chainId always comes from a configured chain; the cast only
      // satisfies wagmi's literal-union typing of the `chainId` param.
      const hash = await sendTransaction(wagmiConfig, {
        to: step.tx.to,
        data: step.tx.data,
        value: step.tx.value,
        chainId: step.tx.chainId as (typeof wagmiConfig)['chains'][number]['id'],
      })

      const receipt = await getPublicClient(step.tx.chainId).waitForTransactionReceipt({ hash })

      if (receipt.status !== 'success') throw new Error('Transaction reverted on-chain')

      setExecutedAny(true)
      setStatuses((previous) =>
        previous.map((status, index) => (index === resolvedIndex ? 'done' : status)),
      )
    } catch (error: unknown) {
      setStatuses((previous) =>
        previous.map((status, index) => (index === resolvedIndex ? 'error' : status)),
      )
      setErrorMessage(error instanceof Error ? error.message : String(error))
    }
  }, [position, steps, resolvedIndex])

  return {
    loading,
    steps,
    statuses,
    currentIndex: resolvedIndex,
    allDone,
    executedAny,
    errorMessage,
    executeCurrent,
    stake,
    claimRewards,
  }
}
