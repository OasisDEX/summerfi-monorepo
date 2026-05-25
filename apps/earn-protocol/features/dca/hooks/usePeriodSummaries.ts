import { useCallback, useEffect, useMemo, useState } from 'react'

import { PERIOD_BUCKETS, PERIOD_WINDOW_SIZE } from '@/features/dca/lib/dca-wizard-constants'

export interface PeriodSummary {
  days: number
  runs: number
  executions: number
  totalSourceAmount: number
  totalTargetAmount: number | null
}

interface UsePeriodSummariesParams {
  frequencyDays: number
  amount: number
  estimatedTargetAmount: number | null
  maxTrades: number
  deadline?: string
}

interface UsePeriodSummariesResult {
  periodSummaries: PeriodSummary[]
  canPreviewPrevious: boolean
  canPreviewNext: boolean
  previewPrevious: () => void
  previewNext: () => void
  hasExecutionLimit: boolean
}

export const usePeriodSummaries = ({
  frequencyDays,
  amount,
  estimatedTargetAmount,
  maxTrades,
  deadline,
}: UsePeriodSummariesParams): UsePeriodSummariesResult => {
  const baseBucketIndex = useMemo(() => {
    const idx = PERIOD_BUCKETS.findIndex((days) => days >= frequencyDays)
    const fallback = PERIOD_BUCKETS.length - PERIOD_WINDOW_SIZE
    const clampedIdx = idx === -1 ? fallback : idx

    return Math.min(clampedIdx, fallback)
  }, [frequencyDays])

  const [periodOffset, setPeriodOffset] = useState(0)

  useEffect(() => {
    setPeriodOffset(0)
  }, [baseBucketIndex])

  const maxOffset = PERIOD_BUCKETS.length - PERIOD_WINDOW_SIZE - baseBucketIndex
  const minOffset = -baseBucketIndex
  const clampedOffset = Math.max(minOffset, Math.min(maxOffset, periodOffset))
  const startIndex = baseBucketIndex + clampedOffset

  const periodSummaries = useMemo<PeriodSummary[]>(() => {
    const selected = PERIOD_BUCKETS.slice(startIndex, startIndex + PERIOD_WINDOW_SIZE)
    const now = new Date()
    const deadlineDate = deadline ? new Date(deadline) : null

    return selected.map((days) => {
      const runs = Math.floor(days / frequencyDays)
      let executions = runs

      executions = Math.min(executions, maxTrades)

      // Cap executions by deadline if set
      if (deadlineDate) {
        const MS_PER_DAY = 24 * 60 * 60 * 1000
        const millisecondsDuration = days * MS_PER_DAY
        const periodEndDate = new Date(now.getTime() + millisecondsDuration)

        if (deadlineDate < periodEndDate) {
          const daysUntilDeadline = Math.floor(
            (deadlineDate.getTime() - now.getTime()) / MS_PER_DAY,
          )
          const executionsBeforeDeadline = Math.max(
            0,
            Math.floor(daysUntilDeadline / frequencyDays) + 1,
          )

          executions = Math.min(executions, executionsBeforeDeadline)
        }
      }

      const totalSourceAmount = executions * amount
      const totalTargetAmount = estimatedTargetAmount ? executions * estimatedTargetAmount : null

      return {
        days,
        runs,
        executions,
        totalSourceAmount,
        totalTargetAmount,
      }
    })
  }, [amount, deadline, estimatedTargetAmount, frequencyDays, maxTrades, startIndex])

  const previewPrevious = useCallback(() => setPeriodOffset((prev) => prev - 1), [])
  const previewNext = useCallback(() => setPeriodOffset((prev) => prev + 1), [])

  // Check if any period has hit the execution limit
  const hasExecutionLimit = periodSummaries.some((s) => s.executions < s.runs)
  // If the last period has the limit, don't allow more navigation
  const lastPeriodHasLimit =
    periodSummaries.length > 0 &&
    periodSummaries[periodSummaries.length - 1].executions <
      periodSummaries[periodSummaries.length - 1].runs

  return {
    periodSummaries,
    canPreviewPrevious: clampedOffset > minOffset,
    canPreviewNext: clampedOffset < maxOffset && !lastPeriodHasLimit,
    previewPrevious,
    previewNext,
    hasExecutionLimit,
  }
}
