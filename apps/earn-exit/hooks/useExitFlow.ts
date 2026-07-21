'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Address } from 'viem'
import { sendTransaction } from 'wagmi/actions'

import { getPublicClient } from '@/lib/clients'
import { readExitContext } from '@/lib/exit-context'
import { buildExitPlan, type ExitStep } from '@/lib/exit-plan'
import { type FleetPosition } from '@/lib/positions'
import { wagmiConfig } from '@/providers/Web3Provider'

export type StepStatus = 'pending' | 'in-progress' | 'done' | 'error'

export const useExitFlow = (position: FleetPosition | null, user?: Address) => {
  const [loading, setLoading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [steps, setSteps] = useState<ExitStep[]>([])
  const [statuses, setStatuses] = useState<StepStatus[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [executedAny, setExecutedAny] = useState(false)

  // Build the plan whenever a position is selected (modal opened).
  useEffect(() => {
    let cancelled = false

    setSteps([])
    setStatuses([])
    setErrorMessage(null)
    setPaused(false)
    setExecutedAny(false)

    if (!position || !user) return undefined

    setLoading(true)
    readExitContext(position, user)
      .then((context) => {
        if (cancelled) return

        setPaused(context.paused)
        const plan = buildExitPlan({
          position,
          allowance: context.allowance,
          hasClaimableRewards: context.hasClaimableRewards,
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
  }, [position, user])

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
      // wagmiConfig's `chainId` param is typed as the literal union of its configured chains'
      // ids; ExitStep.tx.chainId is a plain `number` (see exit-plan.ts), so it needs a cast here
      // — the runtime value always comes from one of those same configured chains.
      const hash = await sendTransaction(wagmiConfig, {
        to: step.tx.to,
        data: step.tx.data,
        value: step.tx.value,
        chainId: step.tx.chainId as (typeof wagmiConfig)['chains'][number]['id'],
      })

      // Wait via our own RPC (public client), independent of the wallet's provider.
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
    paused,
    steps,
    statuses,
    currentIndex: resolvedIndex,
    allDone,
    executedAny,
    errorMessage,
    executeCurrent,
  }
}
