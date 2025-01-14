import { Config } from '@summerfi/deployment-types'
import { ChainsType } from '@summerfi/hardhat-utils'
import { DeploymentChain } from '@summerfi/deployment-utils/deployment'
import { MainnetConfig } from './mainnet'
import { LocalhostConfig } from './localhost'

export type ConfigMap = Partial<Record<ChainsType | DeploymentChain, Config>>

export const DeploymentConfig: ConfigMap = {
  localhost: LocalhostConfig,
  mainnet: MainnetConfig,
}
