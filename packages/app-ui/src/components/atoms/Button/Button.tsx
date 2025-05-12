import { createElement, type FC, forwardRef } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { type AtomProps } from '@/components/atoms/types'

import buttonStyles, { type ClassNames } from '@/components/atoms/Button/Button.module.css'

// TODO this props handling is broken, we shouldn't need to manually type disabled prop etc.
export const Button: FC<AtomProps<'button', ClassNames> & { disabled?: boolean; type?: string }> =
  forwardRef(({ as = 'button', className, variant, type, ...props }, ref) => {
    return createElement(as, {
      ...{
        ref,
        className: getAtomClassList({
          className,
          variant: variant ? buttonStyles[variant] : undefined,
        }),
        type,
        ...props,
      },
    })
  })
