import { NetworksType } from '@summerfi/hardhat-utils'
import { DeploymentConfig } from './configs'
import { Config } from '@summerfi/deployment-types'

export function loadDeploymentConfig(network: NetworksType): Config | undefined {
  return DeploymentConfig[network]
}
