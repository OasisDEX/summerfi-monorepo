import {
  type HexData,
  type IAddress,
  TransactionType,
  TransactionMetadataDeposit,
  TransactionMetadataWithdraw,
  TransactionMetadataVaultSwitch,
  type WithdrawTransactionInfo,
  type DepositTransactionInfo,
  type VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'

export function createDepositTransaction(params: {
  target: IAddress
  calldata: HexData
  value?: bigint
  description: string
  metadata: TransactionMetadataDeposit
}): DepositTransactionInfo {
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
}): WithdrawTransactionInfo {
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

export function createVaultSwitchTransaction(params: {
  target: IAddress
  calldata: HexData
  value?: bigint
  description: string
  metadata: TransactionMetadataVaultSwitch
}): VaultSwitchTransactionInfo {
  return {
    transaction: {
      target: params.target,
      calldata: params.calldata,
      value: String(params.value ?? 0),
    },
    description: params.description,
    type: TransactionType.VaultSwitch,
    metadata: params.metadata,
  }
}
