import { loadDeploymentConfig } from '@summerfi/deployment-configs'
import { Config, DependencyConfig, ProtocolsConfig, SystemConfig } from '@summerfi/deployment-types'
import { DeploymentFlags, Deployments, ProviderTypes } from '@summerfi/deployment-utils'

async function deploySystem(ds: Deployments, system: SystemConfig) {
  for (const subsystem of Object.values(system)) {
    for (const contractInfo of Object.values(subsystem)) {
      const constructorArgs = resolveConstructorArgs(ds, contractInfo.constructorArgs)
      await ds.deploy(contractInfo.name, constructorArgs)
    }
  }
}

async function deployDependencies(ds: Deployments, dependencies: DependencyConfig) {
  for (const dependencyGroup of Object.values(dependencies)) {
    for (const contractInfo of Object.values(dependencyGroup)) {
      await ds.addDependency(contractInfo.name, contractInfo.address)
    }
  }
}

async function deployProtocols(ds: Deployments, protocols: ProtocolsConfig) {
  for (const protocol of Object.values(protocols)) {
    if (!protocol.actions) {
      continue
    }

    for (const actionInfo of Object.values(protocol.actions)) {
      const constructorArgs = resolveConstructorArgs(ds, actionInfo.constructorArgs)
      await ds.deploy(actionInfo.name, constructorArgs)
    }

    for (const dependencyInfo of Object.values(protocol.dependencies)) {
      await ds.addDependency(dependencyInfo.name, dependencyInfo.address)
    }
  }
}

async function deploy(ds: Deployments, config: Config) {
  await deploySystem(ds, config.system)
  await deployDependencies(ds, config.dependencies)
  await deployProtocols(ds, config.protocols)
}

async function main() {
  const network = 'mainnet'

  const config = loadDeploymentConfig(network)
  if (!config) {
    throw new Error('No deployment config found for mainnet')
  }

  const ds = new Deployments({
    type: {
      provider: ProviderTypes.Hardhat,
      network: network,
      config: 'test',
    },
    options: DeploymentFlags.Export,
  })

  await deploy(ds, config)
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
