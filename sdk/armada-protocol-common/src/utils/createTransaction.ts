import type { HexData, IAddress, TransactionInfo } from '@summerfi/sdk-common'

export function createTransaction(params: {
  target: IAddress
  calldata: HexData
  description: string
  value?: bigint
}): TransactionInfo {
  return {
    transaction: {
      target: params.target,
      calldata: params.calldata,
      value: String(params.value ?? 0),
    },
    description: params.description,
  }
}
