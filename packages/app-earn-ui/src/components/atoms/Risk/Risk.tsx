import { type CSSProperties, type ReactNode } from 'react'
import { type RiskType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import { riskColors } from '@/helpers/risk-colors'

import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.css'

export const Risk = ({
  risk,
  variant = 'p3semi',
  as = 'p',
  styles,
}: {
  risk: RiskType
  variant?: TextVariants
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
