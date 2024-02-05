import { Config } from '@summerfi/deployment-types'
import { NetworksType } from '@summerfi/hardhat-utils'
import { MainnetConfig } from './mainnet'

export type ConfigMap = Partial<Record<NetworksType, Config>>

export const DeploymentConfig: ConfigMap = {
  mainnet: MainnetConfig,
}
