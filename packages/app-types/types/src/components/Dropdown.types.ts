import { type SDKNetwork, type SDKChainId } from '../earn-protocol'
import type { IconNamesList, TokenSymbolsList } from '../icons'

import { ReactNode } from 'react'

export type DropdownOption =
  | {
      label: string
      value: string
      tokenSymbol: TokenSymbolsList
      chainId?: SDKChainId
      network?: SDKNetwork
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
