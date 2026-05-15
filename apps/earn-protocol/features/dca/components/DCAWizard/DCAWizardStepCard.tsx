import { type FC, type ReactNode } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAWizardStepCardProps {
  title: string
  children: ReactNode
}

export const DCAWizardStepCard: FC<DCAWizardStepCardProps> = ({ title, children }) => {
  return (
    <Card variant="cardSecondary" className={classNames.stepCard}>
      <Text variant="p3semi" className={classNames.stepCardTitle}>
        {title}
      </Text>
      {children}
    </Card>
  )
}
