import type {
  Address,
  ContractSpecificRoleName,
  GlobalRoles,
  AddressValue,
  InstiRoleName,
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
