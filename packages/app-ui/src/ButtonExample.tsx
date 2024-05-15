import { ReactNode } from 'react'

import buttonExampleStyles from '@/ButtonExample.module.scss'

export const ButtonExample = ({ children, text }: { children: ReactNode; text?: string }) => {
  return (
    <button className={buttonExampleStyles.buttonExampleStyle}>
      {text}
      {children}
    </button>
  )
}
