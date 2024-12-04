import { type CSSProperties, type PropsWithChildren } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
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
  onClick,
}: PropsWithChildren<{
  gap?: string | number
  style?: CSSProperties
  variant?: TextClassNames
  as?: TextAllowedHtmlTags
  className?: string
  reserveSpace?: boolean
  withAnimated?: boolean
  withStatic?: boolean
  onClick?: () => void
}>) {
  return (
    <span style={{ display: 'flex', alignItems: 'center' }} onClick={onClick}>
      <Text
        variant={variant}
        className={clsx(withArrowStyles.withArrow, className)}
        style={{ color: 'var(--earn-protocol-primary-100)', ...style }}
        {...(as ? { as } : { as: 'span' })}
      >
        <span style={{ marginRight: gap }}>{children}</span>
        {withAnimated && !withStatic && (
          <>
            {/* This one won't be displayed, it's just to reserve space for actual arrow. */}
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
                ...(variant.includes('Colorful') && {
                  backgroundImage: 'var(--gradient-earn-protocol-dark)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }),
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
