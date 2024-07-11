import { createElement, type FC, forwardRef } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { type AtomProps } from '@/components/atoms/types'

import classNames, { type ClassNames } from '@/components/atoms/Button/Button.module.scss'

// TODO this props handling is broken, we shouldn't need to manually type disabled prop etc.
export const Button: FC<AtomProps<'button', ClassNames> & { disabled?: boolean }> = forwardRef(
  ({ as = 'button', className, variant, ...props }, ref) => {
    return createElement(as, {
      ...{
        ref,
        className: getAtomClassList({
          className,
          variant: variant ? classNames[variant] : undefined,
        }),
        ...props,
      },
    })
  },
)
