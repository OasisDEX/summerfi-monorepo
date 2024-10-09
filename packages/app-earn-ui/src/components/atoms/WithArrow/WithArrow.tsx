import clsx from 'clsx'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'
import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.scss'

export function WithArrow({
  children,
  gap = 2,
  variant = 'p3',
  style,
  as,
  enabled = true,
  className,
  reserveSpace,
}: React.PropsWithChildren<{
  gap?: string | number
  style?: React.CSSProperties
  variant?: TextClassNames
  as?: TextAllowedHtmlTags
  enabled?: boolean
  className?: string
  reserveSpace?: boolean
}>) {
  return (
    <Text
      variant={variant}
      className={clsx(withArrowStyles.withArrow, className)}
      style={style}
      {...(as ? { as } : { as: 'span' })}
    >
      <span style={{ marginRight: gap }}>{children}</span>
      {enabled && (
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
  )
}
