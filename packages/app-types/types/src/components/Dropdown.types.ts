import type { IconNamesList, TokenSymbolsList } from '../icons'

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
