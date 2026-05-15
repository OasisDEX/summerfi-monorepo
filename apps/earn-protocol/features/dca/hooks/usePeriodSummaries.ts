import { useCallback, useEffect, useMemo, useState } from 'react'

import { PERIOD_BUCKETS, PERIOD_WINDOW_SIZE } from '@/features/dca/lib/dca-wizard-constants'

export interface PeriodSummary {
  days: number
  runs: number
  totalSourceAmount: number
  totalTargetAmount: number | null
}

interface UsePeriodSummariesParams {
  frequencyDays: number
  amount: number
  estimatedTargetAmount: number | null
}

interface UsePeriodSummariesResult {
  periodSummaries: PeriodSummary[]
  canPreviewPrevious: boolean
  canPreviewNext: boolean
  previewPrevious: () => void
  previewNext: () => void
}

export const usePeriodSummaries = ({
  frequencyDays,
  amount,
  estimatedTargetAmount,
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

    return selected.map((days) => {
      const runs = Math.floor(days / frequencyDays)
      const totalSourceAmount = runs * amount
      const totalTargetAmount = estimatedTargetAmount ? runs * estimatedTargetAmount : null

      return {
        days,
        runs,
        totalSourceAmount,
        totalTargetAmount,
      }
    })
  }, [amount, estimatedTargetAmount, frequencyDays, startIndex])

  const previewPrevious = useCallback(() => setPeriodOffset((prev) => prev - 1), [])
  const previewNext = useCallback(() => setPeriodOffset((prev) => prev + 1), [])

  return {
    periodSummaries,
    canPreviewPrevious: clampedOffset > minOffset,
    canPreviewNext: clampedOffset < maxOffset,
    previewPrevious,
    previewNext,
  }
}
