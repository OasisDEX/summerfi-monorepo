import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { type AtomProps } from '@/components/atoms/types'

import textStyles, { type ClassNames, type Styles } from '@/components/atoms/Text/Text.module.css'

export type TextAllowedHtmlTags =
  | 'address'
  | 'blockquote'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'p'
  | 'pre'
  | 'small'
  | 'span'

export const Text: ForwardRefExoticComponent<
  Omit<AtomProps<TextAllowedHtmlTags, keyof Styles>, 'ref'> &
    RefAttributes<
      | HTMLSpanElement
      | HTMLElement
      | HTMLLabelElement
      | HTMLQuoteElement
      | HTMLHeadingElement
      | HTMLParagraphElement
      | HTMLPreElement
    >
> = forwardRef<
  HTMLElementTagNameMap[TextAllowedHtmlTags],
  AtomProps<TextAllowedHtmlTags, ClassNames>
>(({ as = 'span', className, variant = 'p1', ...props }, ref) => {
  return createElement(as, {
    ...{
      ...props,
      ref,
      className: getAtomClassList({ className, variant: textStyles[variant] }),
    },
  })
})
