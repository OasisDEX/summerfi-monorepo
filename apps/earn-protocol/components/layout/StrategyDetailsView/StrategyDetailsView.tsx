'use client'

import { StrategyDetailsFaq } from '@/features/strategy-details/components/StrategyDetailsFaq/StrategyDetailsFaq'
import { StrategyDetailsHowItWorks } from '@/features/strategy-details/components/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'
import { StrategyDetailsSecurity } from '@/features/strategy-details/components/StrategyDetailsSecurity/StrategyDetailsSecurity'
import { StrategyDetailsYields } from '@/features/strategy-details/components/StrategyDetailsYields/StrategyDetailsYields'

export const StrategyDetailsView = () => {
  return (
    <>
      <StrategyDetailsHowItWorks />
      <StrategyDetailsYields />
      <StrategyDetailsSecurity />
      <StrategyDetailsFaq />
    </>
  )
}
