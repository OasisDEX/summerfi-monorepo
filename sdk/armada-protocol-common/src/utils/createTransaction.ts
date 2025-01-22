import {
  type HexData,
  type IAddress,
  type ExtendedTransactionInfo,
  TransactionType,
  TransactionMetadataDeposit,
  TransactionMetadataWithdraw,
} from '@summerfi/sdk-common'

export function createDepositTransaction(params: {
  target: IAddress
  calldata: HexData
  value?: bigint
  description: string
  metadata: TransactionMetadataDeposit
}): ExtendedTransactionInfo {
  return {
    transaction: {
      target: params.target,
      calldata: params.calldata,
      value: String(params.value ?? 0),
    },
    description: params.description,
    type: TransactionType.Deposit,
    metadata: params.metadata,
  }
}

export function createWithdrawTransaction(params: {
  target: IAddress
  calldata: HexData
  value?: bigint
  description: string
  metadata: TransactionMetadataWithdraw
}): ExtendedTransactionInfo {
  return {
    transaction: {
      target: params.target,
      calldata: params.calldata,
      value: String(params.value ?? 0),
    },
    description: params.description,
    type: TransactionType.Withdraw,
    metadata: params.metadata,
  }
}
