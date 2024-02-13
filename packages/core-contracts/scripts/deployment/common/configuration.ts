import { Config, ConfigEntry } from '@summerfi/deployment-types'
import { Contract, Deployments } from '@summerfi/deployment-utils'
import { Address } from '@summerfi/common'
import { ContractsVersionsSnapshot } from '../../contract-versions/common'
import ContractVersions from '../../../src/versions/contracts-versions.snapshot.json'
import { getContractLabel, getLabelHash, recurseConfig } from './utils'

async function addEntryToRegistry(
  serviceRegistry: Contract,
  label: string,
  address: Address,
): Promise<void> {
  const entryHash = getLabelHash(label)
  await serviceRegistry.write.addNamedService([entryHash, address])
}

async function updateRegistry(
  ds: Deployments,
  serviceRegistry: Contract,
  contractName: string,
  contractVersions: ContractsVersionsSnapshot,
  spacer: string = '',
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

  console.log(`${spacer}  - Adding ${contractName} to registry as '${contractLabel}'...`)
  await addEntryToRegistry(serviceRegistry, contractLabel, contractAddress)

  return true
}

async function processConfigurationEntry(
  ds: Deployments,
  configName: string,
  configEntry_: object,
  spacer: string,
): Promise<boolean> {
  const configEntry = configEntry_ as ConfigEntry
  const serviceRegistry = ds.getContract('ServiceRegistry')
  if (!serviceRegistry) {
    throw new Error('ServiceRegistry not found')
  }

  if (configEntry.addToRegistry === undefined) {
    return true
  }

  return await updateRegistry(ds, serviceRegistry, configEntry.name, ContractVersions, spacer)
}

export async function configureAll(ds: Deployments, config: Config) {
  console.log('[CONFIGURATION]')
  return recurseConfig(ds, 'config', config, processConfigurationEntry, ['automation'])
}
