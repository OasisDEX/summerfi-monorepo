import type {
  Address,
  ContractSpecificRoleName,
  GlobalRoles,
  AddressValue,
  GraphRoleName,
  ChainId,
  Percentage,
} from '@summerfi/sdk-common'
import type { TestConfigs, TestClientIds } from './testConfig'

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
  chainConfigKey: keyof typeof TestConfigs
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

export type PositionsScenario = {
  description: string
  clientId?: TestClientIds
  testSpecificFleet?: boolean
}

export type SwapScenario = {
  description: string
  chainId: ChainId
  fromTokenSymbol: string
  toTokenSymbol: string
  fromAmount: string
  slippage: Percentage
}
