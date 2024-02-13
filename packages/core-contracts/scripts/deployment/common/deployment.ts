import { Config, ConfigEntry } from '@summerfi/deployment-types'
import { Deployments } from '@summerfi/deployment-utils'
import { recurseConfig } from './utils'

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

async function processDeploymentEntry(
  ds: Deployments,
  configName: string,
  configEntry_: object,
  spacer: string,
): Promise<boolean> {
  const configEntry = configEntry_ as ConfigEntry

  if (configEntry.address === undefined) {
    console.log(`${spacer}  - Deploying ${configName}...`)
    const constructorArgs = resolveConstructorArgs(ds, configEntry.constructorArgs)

    try {
      await ds.deploy(configEntry.name, constructorArgs)
    } catch (e) {
      console.log('Error deploying', configName, e)
      return false
    }
  }

  return true
}

export async function deployAll(ds: Deployments, config: Config) {
  console.log('[DEPLOYMENT]')
  return recurseConfig(ds, 'config', config, processDeploymentEntry, ['automation'])
}
