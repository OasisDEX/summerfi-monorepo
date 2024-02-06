import {
  Address,
  Config,
  DependenciesConfig,
  ProtocolsConfig,
  SystemConfig,
} from '@summerfi/deployment-types'
import { Contract, Deployments } from '@summerfi/deployment-utils'
import { keccak256 } from '@ethersproject/keccak256'
import { ContractsVersionsSnapshot } from '../../contract-versions/common'
import ContractVersions from '../../../src/versions/contracts-versions.snapshot.json'

function getContractLabel(
  contractName: string,
  versions: ContractsVersionsSnapshot,
): string | undefined {
  const contractVersion = versions.contracts[contractName]?.latestVersion
  if (!contractVersion) {
    return contractName
  }

  return `${contractName}_v${contractVersion}`
}

async function updateRegistry(
  ds: Deployments,
  serviceRegistry: Contract,
  contractName: string,
  contractVersions: ContractsVersionsSnapshot,
): Promise<boolean> {
  const contractAddress = ds.getAddress(contractName)
  if (!contractAddress) {
    console.error(`Contract ${contractName} not deployed`)
    return false
  }

  const contractLabel = getContractLabel(contractName, contractVersions)
  if (!contractLabel) {
    console.error(`Contract ${contractName} not found in versions`)
    return false
  }

  console.log(`  - Adding ${contractName} to registry as '${contractLabel}'...`)
  await addEntryToRegistry(serviceRegistry, contractLabel, contractAddress)

  return true
}

async function addEntryToRegistry(
  serviceRegistry: Contract,
  label: string,
  address: Address,
): Promise<void> {
  const encoder = new TextEncoder()
  const encodedLabel = encoder.encode(label)
  const entryHash = keccak256(encodedLabel)
  await serviceRegistry.write.addNamedService([entryHash, address])
}

async function configureSystem(
  ds: Deployments,
  system: SystemConfig,
  serviceRegistry: Contract,
): Promise<boolean> {
  console.log('[System]')
  for (const [subsystemName, subsystem] of Object.entries(system)) {
    if (subsystemName === 'automation') {
      continue
    }

    console.log(`  [${subsystemName}]`)

    for (const contractInfo of Object.values(subsystem)) {
      if (contractInfo.addToRegistry) {
        const isUpdated = await updateRegistry(
          ds,
          serviceRegistry,
          contractInfo.name,
          ContractVersions,
        )
        if (!isUpdated) {
          return false
        }
      }
    }
  }

  return true
}

async function configureProtocols(
  ds: Deployments,
  protocols: ProtocolsConfig,
  serviceRegistry: Contract,
): Promise<boolean> {
  console.log('[Protocols]')
  for (const [protocolName, protocol] of Object.entries(protocols)) {
    console.log(`  [${protocolName}]`)

    if (!protocol.actions) {
      continue
    }

    for (const contractInfo of Object.values(protocol.actions)) {
      if (contractInfo.addToRegistry) {
        const isUpdated = await updateRegistry(
          ds,
          serviceRegistry,
          contractInfo.name,
          ContractVersions,
        )
        if (!isUpdated) {
          return false
        }
      }
    }

    for (const contractInfo of Object.values(protocol.dependencies)) {
      if (contractInfo.addToRegistry) {
        const isUpdated = await updateRegistry(
          ds,
          serviceRegistry,
          contractInfo.name,
          ContractVersions,
        )
        if (!isUpdated) {
          return false
        }
      }
    }
  }

  return true
}

async function configureDependencies(
  ds: Deployments,
  dependencies: DependenciesConfig,
  serviceRegistry: Contract,
): Promise<boolean> {
  console.log('[Dependencies]')
  for (const [dependencyGroupName, dependencyGroup] of Object.entries(dependencies)) {
    console.log(`  [${dependencyGroupName}]`)
    for (const contractInfo of Object.values(dependencyGroup)) {
      if (contractInfo.addToRegistry) {
        const isUpdated = await updateRegistry(
          ds,
          serviceRegistry,
          contractInfo.name,
          ContractVersions,
        )
        if (!isUpdated) {
          return false
        }
      }
    }
  }

  return true
}

export async function configureDeployment(ds: Deployments, config: Config): Promise<boolean> {
  const serviceRegistry = ds.getContract('ServiceRegistry')
  if (!serviceRegistry) {
    console.error('ServiceRegistry contract not found')
    return false
  }

  console.log('Configuring deployment...')
  await configureSystem(ds, config.system, serviceRegistry)
  await configureProtocols(ds, config.protocols, serviceRegistry)
  await configureDependencies(ds, config.dependencies, serviceRegistry)

  return true
}
