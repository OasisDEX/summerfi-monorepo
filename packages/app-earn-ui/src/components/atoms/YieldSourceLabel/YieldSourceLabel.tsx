import { type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import yieldSourceLabelStyles from './YieldSourceLabel.module.css'

export const YieldSourceLabel: FC<{
  label: ReactNode
}> = ({ label }) => {
  return (
    <div className={yieldSourceLabelStyles.yieldSourceLabel}>
      <Text variant="p4semiColorful">{label}</Text>
    </div>
  )
}
