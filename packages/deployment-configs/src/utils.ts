import { ChainsType } from '@summerfi/hardhat-utils'
import { DeploymentConfig } from './configs'
import { Config } from '@summerfi/deployment-types'

export function loadDeploymentConfig(network: ChainsType): Config | undefined {
  return DeploymentConfig[network]
}
