import { Config, ConfigEntry } from '@summerfi/deployment-types'
import { Deployments } from '@summerfi/deployment-utils'
import { recurseConfig } from './utils'
import { ContractsVersionsSnapshot } from '../versions'

async function processDependencyEntry(
  ds: Deployments,
  versions: ContractsVersionsSnapshot,
  configName: string,
  configEntry_: object,
  spacer: string,
): Promise<boolean> {
  const configEntry = configEntry_ as ConfigEntry

  if (configEntry.address !== undefined) {
    console.log(`${spacer}  - Add dependency ${configName}...`)
    ds.addDependency(configEntry.name, configEntry.address)
  }

  return true
}

export async function addAllDependencies(ds: Deployments, versions: ContractsVersionsSnapshot, config: Config) {
  console.log('[DEPLOYMENT]')
  return recurseConfig(ds, versions, 'config', config, processDependencyEntry, ['automation'])
}
