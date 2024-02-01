import type { NetworksType } from '@summerfi/hardhat-utils'
import { Networks } from '@summerfi/hardhat-utils'
import { Contract, TransactionReceipt } from './viem-types'

export enum ProviderTypes {
  Internal = 'internal',
  Hardhat = 'hardhat',
  Remote = 'remote',
}

export enum DeploymentNetwork {
  Develop = 'develop',
}

export enum DeploymentFlags {
  None = 0,
  Export = 1 << 1,
  Verify = 1 << 2,
}

export enum DirectoryFilterType {
  None,
  Include,
  Exclude,
}

export interface DeploymentExportPair {
  name: string
  value: string
}
export interface ImportPair {
  name: string
  path: string
}
export interface DeploymentInitParams {
  type: DeploymentType
  options: DeploymentOptions
  deploymentsDir?: string
  indexDir?: string
}

export interface DeploymentObject {
  timestamp: number
  provider: Provider
  network: Network
  config: ConfigName
  contracts: {
    [contractName: string]: {
      address: string
      blockNumber: bigint
    }
  }
  dependencies: {
    [dependencyName: string]: {
      address: string
    }
  }
}

export interface DeploymentParams {
  options?: DeploymentOptions
  alias?: string // The deployed contract will be exported in the JSON file with this alias
  contract?: string // Path and name of the contract to be verified i.e.: contracts/Example.sol:ExampleContract
}

export interface Deployment {
  contract: Contract
  name: string
  receipt?: TransactionReceipt
}

export type DeploymentOptions = DeploymentFlags

export type Provider = ProviderTypes
export type Network = NetworksType | DeploymentNetwork
export type ConfigName = string
export interface DeploymentType {
  provider: Provider
  network: Network
  config: ConfigName
}

export function isProvider(value: string): value is Provider {
  return Object.values<string>(ProviderTypes).includes(value)
}

export function isNetwork(value: string): value is Network {
  return (
    Object.values<string>(DeploymentNetwork).includes(value) ||
    Object.values<string>(Networks).includes(value)
  )
}
