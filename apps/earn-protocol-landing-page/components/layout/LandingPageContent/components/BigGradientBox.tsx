import { type FC, type ReactNode } from 'react'

import bigGradientBoxStyles from './BigGradientBox.module.scss'

export const BigGradientBox: FC<{
  children: ReactNode
}> = ({ children }) => {
  return <div className={bigGradientBoxStyles.bigGradientBox}>{children}</div>
}
