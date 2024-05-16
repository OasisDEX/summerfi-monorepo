import { FC, forwardRef } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'
import { AtomProps } from '@/components/atoms/types'

import classNames, { ClassNames } from '@/components/atoms/Button/Button.module.scss'

export const Button: FC<AtomProps<'button', ClassNames>> = forwardRef(
  ({ as = 'button', className, variant, ...props }, ref) => {
    const Component = as

    return (
      <Component
        {...{
          ref,
          className: getAtomClassList({
            className,
            variant: variant ? classNames[variant] : undefined,
          }),
          ...props,
        }}
      />
    )
  },
)
