import { type CSSProperties, type ReactNode } from 'react'
import { type RiskType } from '@summerfi/app-types'
import capitalize from 'lodash-es/capitalize'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import type TextVariants from '@/components/atoms/Text/Text.module.css'
import { riskColors } from '@/helpers/risk-colors'

export const Risk = ({
  risk,
  variant = 'p3semi',
  as = 'p',
  styles,
}: {
  risk: RiskType
  variant?: keyof typeof TextVariants
  as?: TextAllowedHtmlTags
  styles?: CSSProperties
}): ReactNode => {
  const color = riskColors[risk]

  return (
    <Text as={as} variant={variant} style={{ color, ...styles }}>
      {capitalize(risk)} Risk
    </Text>
  )
}
