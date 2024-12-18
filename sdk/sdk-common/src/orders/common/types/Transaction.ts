import { HexData } from '../../../common/types'
import { Address } from '../../../common/implementation/Address'

/**
 * @interface Transaction
 * @description Low level transaction that can be sent to the blockchain
 */
export type Transaction = {
  target: Address
  calldata: HexData
  value: string
}
