import { type ReactNode } from 'react'
import { type RiskType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import type TextVariants from '@/components/atoms/Text/Text.module.css'
import { riskColors } from '@/helpers/risk-colors'

export const Risk = ({
  risk,
  variant = 'p3semi',
  as = 'p',
}: {
  risk: RiskType
  variant?: keyof typeof TextVariants
  as?: TextAllowedHtmlTags
}): ReactNode => {
  const color = riskColors[risk]

  return (
    <Text as={as} variant={variant} style={{ color }}>
      {capitalize(risk)} Risk
    </Text>
  )
}
