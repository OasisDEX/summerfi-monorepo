import { Address } from '@summerfi/common'
import { SystemActionNames } from './system'
import { ProtocolActionNames } from './protocols/types'

export interface ConfigEntry {
  name: string
  address?: Address
  addToRegistry?: boolean
  constructorArgs?: string[]
}

export type ActionNames = SystemActionNames | ProtocolActionNames
