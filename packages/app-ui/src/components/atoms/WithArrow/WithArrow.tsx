import React from 'react'
import classNames from 'classnames'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { type ClassNames } from '@/components/atoms/Text/Text.module.scss'
import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.scss'

export function WithArrow({
  children,
  gap = 2,
  variant = 'p3',
  style,
  as,
  enabled = true,
  className,
}: React.PropsWithChildren<{
  gap?: string | number
  style?: React.CSSProperties
  variant?: ClassNames
  as?: TextAllowedHtmlTags
  enabled?: boolean
  className?: string
}>) {
  return (
    <Text
      variant={variant}
      className={classNames(withArrowStyles.withArrow, className)}
      style={style}
      {...(as ? { as } : { as: 'span' })}
    >
      <span style={{ marginRight: gap }}>{children}</span>
      {enabled && (
        <span className="arrow" style={{ position: 'absolute' }}>
          →
        </span>
      )}
    </Text>
  )
}
