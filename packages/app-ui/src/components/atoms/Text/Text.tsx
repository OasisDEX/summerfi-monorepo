import { createElement, forwardRef } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { type AtomProps } from '@/components/atoms/types'

import textStyles, { type ClassNames } from '@/components/atoms/Text/Text.module.scss'

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

export const Text = forwardRef<
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
