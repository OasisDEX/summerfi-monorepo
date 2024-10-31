import { type CSSProperties, type PropsWithChildren } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'
import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.scss'

export function WithArrow({
  children,
  gap = 2,
  variant = 'p3',
  style,
  as,
  className,
  reserveSpace,
  withAnimated = true,
  withStatic = false,
}: PropsWithChildren<{
  gap?: string | number
  style?: CSSProperties
  variant?: TextClassNames
  as?: TextAllowedHtmlTags
  className?: string
  reserveSpace?: boolean
  withAnimated?: boolean
  withStatic?: boolean
}>) {
  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Text
        variant={variant}
        className={clsx(withArrowStyles.withArrow, className)}
        style={style}
        {...(as ? { as } : { as: 'span' })}
      >
        <span style={{ marginRight: gap }}>{children}</span>
        {withAnimated && !withStatic && (
          <>
            {reserveSpace && (
              <span className="arrow" style={{ color: 'transparent' }}>
                →
              </span>
            )}
            <span
              className="arrow"
              style={{
                position: 'absolute',
                ...(reserveSpace && { right: 0 }),
              }}
            >
              →
            </span>
          </>
        )}
      </Text>
      {withStatic && (
        <Icon iconName="arrow_increase" color="var(--earn-protocol-primary-100)" variant="xs" />
      )}
    </span>
  )
}
