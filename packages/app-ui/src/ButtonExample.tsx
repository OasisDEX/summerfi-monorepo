import { ReactNode } from 'react'
import classnames from 'classnames'

import buttonExampleStyles from '@/ButtonExample.module.scss'

export const ButtonExample = ({ children, text }: { children: ReactNode; text?: string }) => {
  return (
    <button
      className={classnames(buttonExampleStyles.buttonExampleStyle, buttonExampleStyles.testets)}
    >
      {text}
      {children}
    </button>
  )
}
