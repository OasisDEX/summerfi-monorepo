import { createElement, type FC, forwardRef } from 'react'
import clsx from 'clsx'

import { type AtomProps, getAtomClassList } from '@/components/atoms/getAtomClassList'

import buttonStyles from '@/components/atoms/Button/Button.module.css'

export type ButtonVariant = keyof typeof buttonStyles

// TODO this props handling is broken, we shouldn't need to manually type disabled prop etc.
export const Button: FC<
  AtomProps<'button', ButtonVariant> & {
    disabled?: boolean
    active?: boolean
    type?: string
  }
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
