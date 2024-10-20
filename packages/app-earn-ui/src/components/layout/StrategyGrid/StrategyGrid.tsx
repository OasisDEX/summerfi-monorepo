'use client'

import { type ReactNode } from 'react'
import { type DropdownOption } from '@summerfi/app-types'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { TitleWithSelect } from '@/components/molecules/TitleWithSelect/TitleWithSelect'

import strategyGridStyles from './StrategyGrid.module.scss'

type StrategyGridProps = {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
  networksList: DropdownOption[]
  onChangeNetwork: (selected: DropdownOption) => void
  selectedNetwork?: DropdownOption
}

export const StrategyGrid = ({
  topContent,
  leftContent,
  rightContent,
  networksList,
  selectedNetwork,
  onChangeNetwork,
}: StrategyGridProps) => {
  return (
    <>
      <div className={strategyGridStyles.strategyGridHeaderWrapper}>
        <TitleWithSelect
          title="Earn"
          options={networksList}
          onChangeNetwork={onChangeNetwork}
          selected={selectedNetwork}
        />
        <Link href="/">
          <Text as="p" variant="p3semi">
            <WithArrow>What is Earn protocol</WithArrow>
          </Text>
        </Link>
      </div>
      <div className={strategyGridStyles.strategyGridPositionWrapper}>
        <Box className={strategyGridStyles.fullWidthBlock}>{topContent}</Box>
        <Box className={strategyGridStyles.leftBlock}>{leftContent}</Box>
        <div className={strategyGridStyles.rightBlockWrapper}>
          <div className={strategyGridStyles.rightBlock}>{rightContent}</div>
        </div>
      </div>
    </>
  )
}
