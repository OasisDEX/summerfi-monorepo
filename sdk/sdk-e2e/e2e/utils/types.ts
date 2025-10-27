import type {
  Address,
  ChainInfo,
  ContractSpecificRoleName,
  GlobalRoles,
  AddressValue,
  GraphRoleName,
  ChainId,
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
  useAdminSdk?: boolean
  testSpecificVault?: boolean
}
