import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import NumberFlow, {
  continuous,
  type NumberFlowElement,
  type NumberFlowProps,
} from '@number-flow/react'

import { type AtomProps, getAtomClassList } from '@/components/atoms/getAtomClassList'

import textNumberAnimatedStyles from '@/components/atoms/Text/TextNumberAnimated.module.css'

export type TextNumberAnimatedAllowedHtmlTags = 'span' | 'div' | 'p'

interface TextNumberAnimatedProps
  extends Omit<
    AtomProps<TextNumberAnimatedAllowedHtmlTags, keyof typeof textNumberAnimatedStyles>,
    'children' | 'ref'
  > {
  value: number
}

export const TextNumberAnimated: ForwardRefExoticComponent<
  TextNumberAnimatedProps & RefAttributes<NumberFlowElement> & NumberFlowProps
> = forwardRef<NumberFlowElement, TextNumberAnimatedProps & NumberFlowProps>(
  ({ className, variant = 'p1', ...props }, ref) => {
    return (
      <NumberFlow
        {...props}
        ref={ref}
        format={{
          minimumFractionDigits: 2,
          roundingMode: 'trunc',
          notation: 'compact',
          ...props.format,
        }}
        plugins={[continuous]}
        locales="en-US"
        className={getAtomClassList({ className, variant: textNumberAnimatedStyles[variant] })}
      />
    )
  },
)
