import { ContractHash, ContractName, ContractPath } from '@summerfi/contracts-utils'

export type ContractVersion = number

export type ContractVersionHash = {
  version: ContractVersion
  hash: ContractHash
}

export type ContractLatestVersionInfo = {
  name: ContractName
  path: ContractPath
  latestVersion: ContractVersion
  latestHash: ContractHash
}

export type ContractVersionHistoryInfo = ContractLatestVersionInfo & {
  history: ContractVersionHash[]
}

export type ContractsLatestVersions = Record<ContractName, ContractLatestVersionInfo>
export type ContractsVersionsHistory = Record<ContractName, ContractVersionHistoryInfo>

export type ContractsVersionsHistorySnapshot = {
  timestamp: number
  date: string
  contracts: ContractsVersionsHistory
}

export type ContractsLatestVersionsSnapshot = {
  timestamp: number
  date: string
  contracts: ContractsLatestVersions
}
