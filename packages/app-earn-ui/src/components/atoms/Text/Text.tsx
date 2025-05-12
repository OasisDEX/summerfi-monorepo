import {
  createElement,
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react'

import { type AtomProps, getAtomClassList } from '@/components/atoms/getAtomClassList'

import textStyles, { type ClassNames, type Styles } from '@/components/atoms/Text/Text.module.css'

export type TextAllowedHtmlTags =
  | 'blockquote'
  | 'address'
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
  | 'div'
  | 'li'

export const Text: ForwardRefExoticComponent<
  Omit<AtomProps<TextAllowedHtmlTags, keyof Styles>, 'ref'> &
    RefAttributes<
      | HTMLQuoteElement
      | HTMLElement
      | HTMLHeadingElement
      | HTMLLabelElement
      | HTMLParagraphElement
      | HTMLPreElement
      | HTMLSpanElement
      | HTMLDivElement
      | HTMLLIElement
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
