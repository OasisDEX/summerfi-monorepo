import { isConfigEntry } from '@summerfi/deployment-types'
import { Deployments } from '@summerfi/deployment-utils'
import { ContractsVersionsSnapshot } from '~core-contracts/lib/versions'
import { keccak256 } from '@ethersproject/keccak256'

export async function recurseConfig(
  ds: Deployments,
  versions: ContractsVersionsSnapshot,
  configName: string,
  configEntries: object,
  customAction: (
    ds: Deployments,
    versions: ContractsVersionsSnapshot,
    configName: string,
    configEntries: object,
    spacer: string,
  ) => Promise<boolean>,
  exclusionList: string[] = [],
  spacer: string = '',
): Promise<boolean> {
  if (isConfigEntry(configEntries)) {
    return await customAction(ds, versions, configName, configEntries, spacer)
  }

  if (exclusionList.includes(configName)) {
    return true
  }

  console.log(`${spacer}[${configName}]`)
  for (const [subconfigName, subconfigEntries] of Object.entries(configEntries)) {
    const isSuccess = await recurseConfig(
      ds,
      versions,
      subconfigName,
      subconfigEntries as object,
      customAction,
      exclusionList,
      spacer + '  ',
    )
    if (!isSuccess) {
      return false
    }
  }

  return true
}

export function getContractLabel(
  contractName: string,
  versions: ContractsVersionsSnapshot,
): string | undefined {
  const contractVersion = versions.contracts[contractName]?.latestVersion
  if (!contractVersion) {
    return contractName
  }

  return `${contractName}_v${contractVersion}`
}

export function getLabelHash(label: string): string {
  const encoder = new TextEncoder()
  const encodedLabel = encoder.encode(label)
  return keccak256(encodedLabel)
}
