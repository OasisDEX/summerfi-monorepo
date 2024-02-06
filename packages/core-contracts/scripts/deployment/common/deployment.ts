import {
  Config,
  DependenciesConfig,
  ProtocolsConfig,
  SystemConfig,
} from '@summerfi/deployment-types'
import { Deployments } from '@summerfi/deployment-utils'

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

function deployDependencies(ds: Deployments, dependencies: DependenciesConfig) {
  console.log('[Dependencies]')
  for (const [dependencyGroupName, dependencyGroup] of Object.entries(dependencies)) {
    console.log(`  [${dependencyGroupName}]`)
    for (const contractInfo of Object.values(dependencyGroup)) {
      console.log(`    - Add dependency ${contractInfo.name}...`)
      ds.addDependency(contractInfo.name, contractInfo.address)
    }
  }
}

export async function deploy(ds: Deployments, config: Config) {
  console.log('Deploying contracts...')
  await deploySystem(ds, config.system)
  await deployProtocols(ds, config.protocols)
  deployDependencies(ds, config.dependencies)
}
