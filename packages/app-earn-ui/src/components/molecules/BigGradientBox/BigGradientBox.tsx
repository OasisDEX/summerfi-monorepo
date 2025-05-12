import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import bigGradientBoxStyles from './BigGradientBox.module.css'

export const BigGradientBox: FC<{
  reversed?: boolean
  children: ReactNode
  color?: 'purple' | 'red'
  className?: string
}> = ({ children, reversed = false, color = 'purple', className }) => {
  return (
    <div
      className={clsx(bigGradientBoxStyles.bigGradientBox, className, {
        [bigGradientBoxStyles.bigGradientBoxPurple]: !className && color === 'purple',
        [bigGradientBoxStyles.bigGradientBoxRed]: !className && color === 'red',
        [bigGradientBoxStyles.reversed]: !className && reversed,
      })}
    >
      {children}
    </div>
  )
}
