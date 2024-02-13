import { Config, ConfigEntry } from '@summerfi/deployment-types'
import { Deployments } from '@summerfi/deployment-utils'
import ContractVersions from '../../../src/versions/contracts-versions.snapshot.json'
import { getContractLabel, getLabelHash, recurseConfig } from './utils'
import { Address } from '@summerfi/common'

async function processVerificationEntry(
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

  const contractLabel = getContractLabel(configEntry.name, ContractVersions)
  if (!contractLabel) {
    console.error(`Contract ${configEntry.name} not found in versions`)
    return false
  }

  const labelHash = getLabelHash(contractLabel)
  const configuredAddress: Address = (await serviceRegistry.read.getServiceAddress([
    labelHash,
  ])) as Address

  const contractAddress = ds.getAddress(configEntry.name)
  if (!contractAddress) {
    console.error(`Contract ${configEntry.name} not found in the deployment system`)
    return false
  }

  if (configuredAddress.toLowerCase() !== contractAddress.toLowerCase()) {
    console.log(`${configEntry.name} not configured correctly in registry!`)
    return false
  }

  console.log(`${spacer}  - ${configEntry.name} correctly configured in registry`)
  return true
}

export async function verifyAll(ds: Deployments, config: Config) {
  console.log('[VERIFICATION]')
  return recurseConfig(ds, 'config', config, processVerificationEntry, ['automation'])
}
