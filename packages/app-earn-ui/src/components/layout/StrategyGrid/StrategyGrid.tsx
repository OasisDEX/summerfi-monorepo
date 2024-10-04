import { type ReactNode } from 'react'
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
}: {
  topContent: ReactNode
  leftContent: ReactNode
  rightContent: ReactNode
}) => {
  return (
    <>
      <div className={strategyGridStyles.strategyGridHeaderWrapper}>
        <TitleWithSelect
          title="Earn"
          options={[
            {
              iconName: 'usdc_circle_color',
              label: 'Ethereum',
              value: 'ethereum',
            },
            {
              iconName: 'usdc_circle_color',
              label: 'Base',
              value: 'base',
            },
          ]}
          onChangeNetwork={() => {}}
          selected={{
            iconName: 'usdc_circle_color',
            label: 'Ethereum',
            value: 'ethereum',
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
        <Box>{leftContent}</Box>
        {rightContent}
      </div>
    </>
  )
}
