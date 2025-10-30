import type {
  Address,
  ContractSpecificRoleName,
  GlobalRoles,
  AddressValue,
  GraphRoleName,
  ChainId,
  FiatCurrency,
  Percentage,
} from '@summerfi/sdk-common'
import type { ChainConfigs, ClientIds } from './testConfig'

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
  chainConfigKey: keyof typeof ChainConfigs
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

export type DepositScenario = {
  description: string
  chainConfig: {
    rpcUrl: string
    chainId: ChainId
    fleetAddressValue: AddressValue
    symbol: string
  }
  amountValue: string
  swapToSymbol?: string
  stake?: boolean
  referralCode?: string
}

export type WithdrawScenario = {
  description: string
  chainConfig: {
    rpcUrl: string
    chainId: ChainId
    fleetAddressValue: AddressValue
    symbol: string
  }
  amountValue: string
  swapToSymbol?: string
}

export type RebalanceScenario = {
  description: string
  fromArk: Address
  toArk: Address
  amount: string
  tokenSymbol: string
}

export type VaultInfoScenario = {
  description: string
  clientId?: ClientIds
  testSpecificVault?: boolean
}

export type PositionsScenario = {
  description: string
  clientId?: ClientIds
  testSpecificFleet?: boolean
}

export type OracleScenario = {
  description: string
  chainId: ChainId
  baseTokenSymbol: string
  denominationTokenSymbol?: string
  denominationFiat?: FiatCurrency
}

export type SwapScenario = {
  description: string
  chainId: ChainId
  fromTokenSymbol: string
  toTokenSymbol: string
  fromAmount: string
  slippage: Percentage
}
