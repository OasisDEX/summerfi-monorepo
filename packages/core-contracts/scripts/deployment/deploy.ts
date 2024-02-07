import { loadDeploymentConfig } from '@summerfi/deployment-configs'
import { DeploymentFlags, Deployments, ProviderTypes } from '@summerfi/deployment-utils'
import { ChainsType } from '@summerfi/hardhat-utils'
import hre from 'hardhat'
import { deployAll, configureAll } from './common'
import { verifyAll } from './common/verification'
import { addAllDependencies } from './common/dependencies'

async function main() {
  const chain = hre.network.name as ChainsType

  const config = loadDeploymentConfig(chain)
  if (!config) {
    console.error(`No deployment config found for ${chain} network`)
    process.exit(1)
  }

  const ds = new Deployments({
    type: {
      provider: ProviderTypes.Hardhat,
      chain: chain,
      config: 'standard',
    },
    options: DeploymentFlags.Export,
    deploymentsDir: 'src/deployments',
    indexDir: 'src/',
  })

  await addAllDependencies(ds, config)
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
