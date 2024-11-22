import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import bigGradientBoxStyles from './BigGradientBox.module.scss'

export const BigGradientBox: FC<{
  children: ReactNode
  reversed?: boolean
}> = ({ children, reversed = false }) => {
  return (
    <div
      className={clsx(bigGradientBoxStyles.bigGradientBox, {
        [bigGradientBoxStyles.reversed]: reversed,
      })}
    >
      {children}
    </div>
  )
}
