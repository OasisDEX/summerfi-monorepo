import { type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import headerDisclaimerStyles from './HeaderDisclaimer.module.css'

interface HeaderDisclaimerProps {
  children: ReactNode
}

export const HeaderDisclaimer: FC<HeaderDisclaimerProps> = ({ children }) => {
  return (
    <Text as="div" variant="p3semi" className={headerDisclaimerStyles.headerDisclaimerWrapper}>
      {children}
    </Text>
  )
}
