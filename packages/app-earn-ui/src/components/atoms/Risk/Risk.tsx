import { type ReactNode } from 'react'
import { type RiskType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Text } from '@/components/atoms/Text/Text'
import { riskColors } from '@/helpers/risk-colors'

import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

export const Risk = ({
  risk,
  variant = 'p3semi',
}: {
  risk: RiskType
  variant: TextVariants
}): ReactNode => {
  const color = riskColors[risk]

  return (
    <Text as="p" variant={variant} style={{ color }}>
      {capitalize(risk)} Risk
    </Text>
  )
}
