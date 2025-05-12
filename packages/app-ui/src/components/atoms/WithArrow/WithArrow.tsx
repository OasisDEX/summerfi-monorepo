import clsx from 'clsx'

import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'

import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.css'
import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.css'

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
  variant?: TextClassNames
  as?: TextAllowedHtmlTags
  enabled?: boolean
  className?: string
}>): React.ReactNode {
  return (
    <Text
      variant={variant}
      className={clsx(withArrowStyles.withArrow, className)}
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
