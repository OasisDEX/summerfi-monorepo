import { createElement, type FC, forwardRef } from 'react'
import clsx from 'clsx'

import { type AtomProps, getAtomClassList } from '@/components/atoms/getAtomClassList'

import buttonStyles, { type ClassNames } from '@/components/atoms/Button/Button.module.scss'

// TODO this props handling is broken, we shouldn't need to manually type disabled prop etc.
export const Button: FC<
  AtomProps<'button', ClassNames> & { disabled?: boolean; active?: boolean; type?: string }
> = forwardRef(({ as = 'button', className, variant, type, active, ...props }, ref) => {
  return createElement(as, {
    ...{
      ref,
      className: clsx(
        getAtomClassList({
          className,
          variant: variant ? buttonStyles[variant] : undefined,
        }),
        {
          [buttonStyles[`${variant}Active`]]: active,
        },
      ),
      type,
      ...props,
    },
  })
})
