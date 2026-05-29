import type { AddressValue } from './AddressValue'

/**
 * @name Permit2PermitData
 * @description The PermitTransferFrom payload consumed by AdmiralsQuarters permit2 calldata
 */
export type Permit2PermitData = {
  permitted: { token: AddressValue; amount: bigint }
  nonce: bigint
  deadline: bigint
}
