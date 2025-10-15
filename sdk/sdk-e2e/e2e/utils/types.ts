import type {
  Address,
  ChainInfo,
  ContractSpecificRoleName,
  GlobalRoles,
} from '@summerfi/sdk-common'

export type ContractRoleScenario = {
  role: ContractSpecificRoleName
  targetAddress: Address
  shouldGrant?: boolean
  shouldRevoke?: boolean
}

export type GlobalRoleScenario = {
  role: GlobalRoles
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
