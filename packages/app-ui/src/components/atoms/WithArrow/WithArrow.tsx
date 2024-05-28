/* eslint-disable no-magic-numbers */
import React from 'react'

import { Text, TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { ClassNames } from '@/components/atoms/Text/Text.module.scss'
import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.scss'

export function WithArrow({
  children,
  gap = 2,
  variant = 'p3',
  style,
  as,
}: React.PropsWithChildren<{
  gap?: string | number
  style?: React.CSSProperties
  variant?: ClassNames
  as?: TextAllowedHtmlTags
}>) {
  return (
    <Text
      variant={variant}
      className={withArrowStyles.withArrow}
      style={style}
      {...(as ? { as } : { as: 'span' })}
    >
      <span style={{ marginRight: gap }}>{children}</span>
      <span className="arrow" style={{ position: 'absolute' }}>
        →
      </span>
    </Text>
  )
}
