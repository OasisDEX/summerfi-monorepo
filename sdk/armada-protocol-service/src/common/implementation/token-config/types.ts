import type { AddressValue } from '@summerfi/sdk-common'

export type ArmadaMigrationConfig = {
  positionAddress: AddressValue
  underlyingToken: AddressValue
  pool: string | null
}
