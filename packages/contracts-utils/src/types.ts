import type { Contract, ContractTransactionReceipt } from 'ethers'
import type { NetworksType } from '@summerfi/hardhat-utils'
import { Networks } from '@summerfi/hardhat-utils'
import type { FactoryOptions } from '@nomicfoundation/hardhat-ethers/types'
import type { MockContract } from '@defi-wonderland/smock'

export enum ProviderTypes {
  Internal = 'internal',
  Ganache = 'ganache',
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
  Upgradeable = 1 << 3,
  Mock = 1 << 4,
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

export interface DeploymentObjectLegacy {
  timestamp: number
  network: Network
  contracts: {
    [contractName: string]: {
      address: string
      blockNumber: number
    }
  }
}

export interface DeploymentObject {
  timestamp: number
  provider: Provider
  network: Network
  config: ConfigName
  contracts: {
    [contractName: string]: {
      address: string
      blockNumber: number
    }
  }
  dependencies: {
    [dependencyName: string]: {
      address: string
    }
  }
}

export type LegacyDeploymentObject = { [key: string]: string } | undefined

export interface DeploymentParams extends FactoryOptions {
  options?: DeploymentOptions
  alias?: string // The deployed contract will be exported in the JSON file with this alias
  contract?: string // Path and name of the contract to be verified i.e.: contracts/Example.sol:ExampleContract
}

export interface Deployment {
  contract: Contract | MockContract<Contract>
  address: string
  name: string
  receipt?: ContractTransactionReceipt
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
