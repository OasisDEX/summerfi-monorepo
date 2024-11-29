import type { IconNamesList, TokenSymbolsList } from '../icons'
import { ReactNode } from 'react'

export type DropdownOption =
  | {
      label: string
      value: string
      tokenSymbol: TokenSymbolsList
    }
  | {
      label: string
      value: string
      iconName: IconNamesList
    }
  | {
      label: string
      value: string
      icon: string
    }

export type DropdownRawOption = {
  value: string
  content: ReactNode
}
