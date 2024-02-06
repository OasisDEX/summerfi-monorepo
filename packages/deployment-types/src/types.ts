import { Address } from '@summerfi/common'

export interface ConfigEntry {
  name: string
  address?: Address
  addToRegistry?: boolean
  constructorArgs?: string[]
}
