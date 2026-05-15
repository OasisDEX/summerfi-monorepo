'use client'

import { useCallback, useState } from 'react'

import { type DCAApprovalStep, type DCAApprovalStepStatus } from '@/features/dca/lib/types'

const INITIAL_STEPS: DCAApprovalStep[] = [
  {
    id: 'approve',
    title: 'Approve source token spending',
    description:
      'Allow the DCA Router to move funds out of your source vault when each execution runs.',
    status: 'idle',
  },
  {
    id: 'authorize',
    title: 'Sign keeper authorization',
    description:
      'Sign an off-chain permission that lets the keeper bot trigger executions on your schedule. No funds move until each scheduled run.',
    status: 'idle',
  },
  {
    id: 'create',
    title: 'Create DCA strategy on-chain',
    description:
      'Deploy your DCA strategy. Stores the schedule and conditions on-chain so executions are verifiable.',
    status: 'idle',
  },
]

interface UseDCAApprovalReturn {
  steps: DCAApprovalStep[]
  activeIndex: number
  isComplete: boolean
  runStep: (index: number) => Promise<void>
  reset: () => void
}

/**
 * UI-only stand-in for the real approval flow.
 *
 * Mirrors the three-step shape of the hackathon `dca-app` (ERC-20 approve →
 * EIP-712 keeper authorisation → on-chain strategy creation) but does not
 * touch the wallet. Replace the simulated `runStep` body with calls into
 * `wagmi.useWriteContract` (port of `lib/approvalTx.ts`) and
 * `signTypedData` (port of `scripts/sign_and_store.ts`) once the router
 * address and keeper API are published by infra.
 */
export const useDCAApproval = (): UseDCAApprovalReturn => {
  const [steps, setSteps] = useState<DCAApprovalStep[]>(INITIAL_STEPS)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateStep = useCallback(
    (index: number, patch: Partial<Pick<DCAApprovalStep, 'status' | 'errorMessage'>>) => {
      setSteps((current) =>
        current.map((step, idx) => (idx === index ? { ...step, ...patch } : step)),
      )
    },
    [],
  )

  const runStep = useCallback(
    async (index: number): Promise<void> => {
      if (index < 0 || index >= INITIAL_STEPS.length) return

      const setStatus = (nextStatus: DCAApprovalStepStatus) =>
        updateStep(index, { status: nextStatus })

      setStatus('pending')

      // Simulated wallet round-trip. Replace with real on-chain / signature
      // flows once the router contract + keeper API are available.
      await new Promise((resolve) => {
        setTimeout(resolve, index === 0 ? 1200 : index === 1 ? 1500 : 2000)
      })

      setStatus('done')

      if (index < INITIAL_STEPS.length - 1) {
        setActiveIndex(index + 1)
      }
    },
    [updateStep],
  )

  const reset = useCallback(() => {
    setSteps(INITIAL_STEPS.map((step) => ({ ...step, status: 'idle', errorMessage: undefined })))
    setActiveIndex(0)
  }, [])

  const isComplete = steps.every((step) => step.status === 'done')

  return { steps, activeIndex, isComplete, runStep, reset }
}
