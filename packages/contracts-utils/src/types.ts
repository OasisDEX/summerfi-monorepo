export type ContractPath = string
export type ContractName = string
export type ContractHash = string

export type ContractInfo = {
  name: ContractName
  path: ContractPath
  hash: ContractHash
}

export type ContractsHashMap = Record<ContractName, ContractInfo>
