import { createElement, type FC, forwardRef } from 'react'

import { type AtomProps, getAtomClassList } from '@/components/atoms/getAtomClassList'

import buttonStyles, { type ClassNames } from '@/components/atoms/Button/Button.module.scss'

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
