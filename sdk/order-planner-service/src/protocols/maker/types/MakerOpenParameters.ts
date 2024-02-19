import { Address } from '@summerfi/sdk/common/index'

export type MakerOpenParameters = {
  joinAddress: Address
}

export function isMakerOpenParameters(parameters: unknown): parameters is MakerOpenParameters {
  return typeof parameters === 'object' && parameters !== null && 'joinAddress' in parameters
}
