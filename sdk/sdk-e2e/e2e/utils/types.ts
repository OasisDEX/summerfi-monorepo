import type {
  Address,
  ChainInfo,
  ContractSpecificRoleName,
  GlobalRoles,
  AddressValue,
  GraphRoleName,
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

export type WhitelistScenario = {
  targetAddress: Address
  description: string
  shouldWhitelist?: boolean
  shouldRemoveFromWhitelist?: boolean
}

export type GetAllRolesScenario = {
  description: string
  roleName?: GraphRoleName
  targetContract?: AddressValue
  owner?: AddressValue
  first?: number
  skip?: number
  expectedMinimumCount?: number
}
