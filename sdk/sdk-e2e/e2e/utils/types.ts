import type { ContractSpecificRoleName, GeneralRoles } from '@summerfi/armada-protocol-common'
import type { Address, ChainInfo } from '@summerfi/sdk-common'

export type ContractRoleScenario = {
  role: ContractSpecificRoleName
  targetAddress: Address
  shouldGrant?: boolean
  shouldRevoke?: boolean
}

export type GeneralRoleScenario = {
  role: GeneralRoles
  targetAddress: Address
  shouldGrant?: boolean
  shouldRevoke?: boolean
}

export type GovTestScenario = {
  chainInfo: ChainInfo
  rpcUrl: string
  userAddress: Address
  enabled?: boolean
}
