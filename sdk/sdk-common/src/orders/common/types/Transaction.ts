import type { IAddress } from '../../../common/interfaces/IAddress'
import type { HexData } from '../../../common/types/HexData'

/**
 * Low level transaction that can be sent to the blockchain
 *
 * @interface
 */
export type Transaction = {
  target: IAddress
  calldata: HexData
  value: string
  gasLimit?: string
}
