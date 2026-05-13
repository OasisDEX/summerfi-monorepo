import type { AddressValue, ChainId, HexData } from '@summerfi/sdk-common'

export type ArmadaDcaOrderStatus = 'active' | 'cancelled'

export interface ArmadaDcaOrder {
  id: string
  userAddress: AddressValue
  chainId: ChainId
  fromVault: AddressValue
  toVault: AddressValue
  amount: string
  slippage: string
  intervalSeconds: number
  nextExecutionAt: number
  deadline: string
  allowedVaultsRoot: HexData
  fromVaultProof: HexData[]
  toVaultProof: HexData[]
  swapCalldata: HexData
  signature: HexData
  ensoRouterAddress: AddressValue
  verifyingContractAddress: AddressValue
  status: ArmadaDcaOrderStatus
  createdAt: number
  updatedAt: number
  cancelledAt?: number
}
