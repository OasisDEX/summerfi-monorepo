'use client'

import { type ReactNode } from 'react'
import { type NetworkNames } from '@summerfi/app-types'
import Link from 'next/link'

import { Box } from '@/components/atoms/Box/Box'
import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { TitleWithSelect } from '@/components/molecules/TitleWithSelect/TitleWithSelect'

import strategyGridStyles from './StrategyGrid.module.scss'

export const StrategyGrid = ({
  topContent,
  leftContent,
  rightContent,
  network,
}: {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
  network: NetworkNames
}) => {
  return (
    <>
      <div className={strategyGridStyles.strategyGridHeaderWrapper}>
        <TitleWithSelect
          title="Earn"
          options={[
            {
              iconName: 'ether_circle_color',
              label: 'Ethereum',
              value: network,
            },
          ]}
          onChangeNetwork={() => {}}
          selected={{
            iconName: 'ether_circle_color',
            label: 'Ethereum',
            value: network,
          }}
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
        {rightContent}
      </div>
    </>
  )
}
