import { loadDeploymentConfig } from '@summerfi/deployment-configs'
import { Config, DependencyConfig, ProtocolsConfig, SystemConfig } from '@summerfi/deployment-types'
import { DeploymentFlags, Deployments, ProviderTypes } from '@summerfi/deployment-utils'
import hre from 'hardhat'
import { NetworksType } from '@summerfi/hardhat-utils'

async function deploySystem(ds: Deployments, system: SystemConfig) {
  console.log('[System]')
  for (const [subsystemName, subsystem] of Object.entries(system)) {
    if (subsystemName === 'automation') {
      continue
    }

    console.log(`  [${subsystemName}]`)

    for (const contractInfo of Object.values(subsystem)) {
      console.log(`  - Deploying ${contractInfo.name}...`)
      const constructorArgs = resolveConstructorArgs(ds, contractInfo.constructorArgs)
      await ds.deploy(contractInfo.name, constructorArgs)
    }
  }
}

async function deployProtocols(ds: Deployments, protocols: ProtocolsConfig) {
  console.log('[Protocols]')
  for (const [protocolName, protocol] of Object.entries(protocols)) {
    console.log(`  [${protocolName}]`)
    if (protocol.actions) {
      console.log('    [actions]')
      for (const actionInfo of Object.values(protocol.actions)) {
        console.log(`      - Deploying ${actionInfo.name}...`)
        const constructorArgs = resolveConstructorArgs(ds, actionInfo.constructorArgs)
        await ds.deploy(actionInfo.name, constructorArgs)
      }
    }

    console.log('    [dependencies]')
    for (const dependencyInfo of Object.values(protocol.dependencies)) {
      console.log(`      - Add dependency ${dependencyInfo.name}...`)
      await ds.addDependency(dependencyInfo.name, dependencyInfo.address)
    }
  }
}

async function deployDependencies(ds: Deployments, dependencies: DependencyConfig) {
  console.log('[Dependencies]')
  for (const [dependencyGroupName, dependencyGroup] of Object.entries(dependencies)) {
    console.log(`  [${dependencyGroupName}]`)
    for (const contractInfo of Object.values(dependencyGroup)) {
      console.log(`    - Add dependency ${contractInfo.name}...`)
      await ds.addDependency(contractInfo.name, contractInfo.address)
    }
  }
}

async function deploy(ds: Deployments, config: Config) {
  console.log('Deploying contracts...')
  await deploySystem(ds, config.system)
  await deployProtocols(ds, config.protocols)
  await deployDependencies(ds, config.dependencies)
}

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

  await deploy(ds, config)

  ds.persist()

  console.log('Deployment done!')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))

function resolveConstructorArgs(
  ds: Deployments,
  constructorArgs?: Array<number | string>,
): Array<number | string> {
  if (!constructorArgs) {
    return []
  }

  return constructorArgs.map((param: string | number) => {
    if (typeof param === 'string' && param.indexOf('address:') >= 0) {
      const contractName = (param as string).replace('address:', '')
      const contractAddress = ds.getAddress(contractName)

      if (!contractAddress) {
        throw new Error(`Contract ${contractName} not deployed`)
      }

      return contractAddress
    } else {
      return param
    }
  })
}
