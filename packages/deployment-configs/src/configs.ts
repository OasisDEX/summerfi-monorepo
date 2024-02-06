import { Config } from '@summerfi/deployment-types'
import { NetworksType } from '@summerfi/hardhat-utils'
import { DeploymentNetwork } from '@summerfi/deployment-utils'
import { MainnetConfig } from './mainnet'
import { LocalhostConfig } from './localhost'

export type ConfigMap = Partial<Record<NetworksType | DeploymentNetwork, Config>>

export const DeploymentConfig: ConfigMap = {
  localhost: LocalhostConfig,
  mainnet: MainnetConfig,
}
