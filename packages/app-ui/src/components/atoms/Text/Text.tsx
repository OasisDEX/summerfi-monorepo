import { FC, forwardRef } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { AtomProps } from '@/components/atoms/types'

import classNames, { ClassNames } from '@/components/atoms/Text/Text.module.scss'

type AllowedHtmlTags =
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

export const Text: FC<AtomProps<AllowedHtmlTags, ClassNames>> = forwardRef(
  ({ as = 'span', className, variant, ...props }, ref) => {
    const Component = as

    return (
      <Component
        {...{
          ref,
          className: getAtomClassList({ className, variant: classNames[variant] }),
          ...props,
        }}
      />
    )
  },
)
