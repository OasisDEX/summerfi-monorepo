import { type ReactNode } from 'react'

import { Box } from '@/components/atoms/Box/Box'

import strategyGridStyles from './StrategyGrid.module.scss'

export const StrategyGrid = ({
  topContent,
  leftContent,
  rightContent,
}: {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
}) => {
  return (
    <div className={strategyGridStyles.strategyGridWrapper}>
      <Box className={strategyGridStyles.fullWidthBlock}>{topContent}</Box>
      <Box>{leftContent}</Box>
      <Box>{rightContent}</Box>
    </div>
  )
}
