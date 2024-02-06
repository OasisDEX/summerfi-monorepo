import { loadDeploymentConfig } from '@summerfi/deployment-configs'
import { DeploymentFlags, Deployments, ProviderTypes } from '@summerfi/deployment-utils'
import { NetworksType } from '@summerfi/hardhat-utils'
import hre from 'hardhat'
import { deployAll, configureAll } from './common'
import { verifyAll } from './common/verification'

async function main() {
  const network = hre.network.name as NetworksType

  const config = loadDeploymentConfig(network)
  if (!config) {
    console.error(`No deployment config found for ${network} network`)
    process.exit(1)
  }

  const ds = new Deployments({
    type: {
      provider: ProviderTypes.Hardhat,
      network: network,
      config: 'standard',
    },
    options: DeploymentFlags.Export,
    deploymentsDir: 'src/deployments',
    indexDir: 'src/',
  })

  await deployAll(ds, config)
  await configureAll(ds, config)
  await verifyAll(ds, config)

  ds.persist()

  console.log('Deployment done!')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
