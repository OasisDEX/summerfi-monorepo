import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import bigGradientBoxStyles from './BigGradientBox.module.css'

export const BigGradientBox: FC<{
  reversed?: boolean
  children: ReactNode
  color?: 'purple' | 'red'
  className?: string
  style?: React.CSSProperties
}> = ({ children, reversed = false, color = 'purple', className, style }) => {
  return (
    <div
      className={clsx(bigGradientBoxStyles.bigGradientBox, className, {
        [bigGradientBoxStyles.bigGradientBoxPurple]: !className && color === 'purple',
        [bigGradientBoxStyles.bigGradientBoxRed]: !className && color === 'red',
        [bigGradientBoxStyles.reversed]: !className && reversed,
      })}
      style={style}
    >
      {children}
    </div>
  )
}
