import { ContractHash, ContractName, ContractPath } from '@summerfi/contracts-utils'

export type ContractVersion = number

export type ContractVersionHash = {
  version: ContractVersion
  hash: ContractHash
  abi?: string
}

export type ContractVersionInfo = {
  name: ContractName
  path: ContractPath
  latestVersion: ContractVersion
  latestHash: ContractHash
  latestAbi?: string
  history?: ContractVersionHash[]
}

export type ContractsVersionsMap = Record<ContractName, ContractVersionInfo>

export type ContractsVersionsSnapshot = {
  timestamp: number
  date: string
  contracts: ContractsVersionsMap
}
