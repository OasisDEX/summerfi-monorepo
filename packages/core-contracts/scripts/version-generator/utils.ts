import { getContractsHashes } from '@summerfi/contracts-utils'
import {
  ContractsLatestVersionsSnapshot,
  ContractsVersionsHistory,
  ContractsVersionsHistorySnapshot,
} from './types'
import fs from 'fs'
import path from 'path'

const EmptyContractsSnapshot: ContractsVersionsHistorySnapshot = {
  timestamp: 0,
  date: '',
  contracts: {},
}

export async function loadCurrentVersionsSnapshot(params: {
  fileName: string
}): Promise<ContractsVersionsHistorySnapshot | undefined> {
  try {
    return JSON.parse(fs.readFileSync(params.fileName, 'utf-8'))
  } catch (error) {
    return undefined
  }
}

export async function generateVersionsHistorySnapshot(params: {
  currentSnapshot?: ContractsVersionsHistorySnapshot
}): Promise<ContractsVersionsHistorySnapshot> {
  const contractsHashesInfo = await getContractsHashes({
    exclusions: ['interfaces', '@openzeppelin', '@prb', 'test', 'hardhat'],
  })

  const currentSnapshot: ContractsVersionsHistorySnapshot =
    params?.currentSnapshot ?? EmptyContractsSnapshot

  const contractsVersions = Object.entries(contractsHashesInfo).reduce(
    (contractsVersions, [contractName, currentVersionInfo]) => {
      const isContractUpdated =
        currentSnapshot.contracts[contractName]?.latestHash !== currentVersionInfo.hash

      const currentVersion = currentSnapshot.contracts[contractName]?.latestVersion ?? 0
      const latestVersion = isContractUpdated ? currentVersion + 1 : currentVersion
      const versionHistory = currentSnapshot.contracts[contractName]?.history ?? []

      if (isContractUpdated) {
        return {
          ...contractsVersions,
          [contractName]: {
            name: contractName,
            path: currentVersionInfo.path,
            latestVersion: latestVersion,
            latestHash: currentVersionInfo.hash,
            history: [...versionHistory],
          },
        }
      } else {
        return {
          ...contractsVersions,
          [contractName]: {
            name: contractName,
            path: currentVersionInfo.path,
            latestVersion: latestVersion,
            latestHash: currentVersionInfo.hash,
            history: [
              {
                version: latestVersion,
                hash: currentVersionInfo.hash,
              },
              ...versionHistory,
            ],
          },
        }
      }
    },
    {} as ContractsVersionsHistory,
  )

  return {
    timestamp: Date.now(),
    date: new Date().toISOString(),
    contracts: contractsVersions,
  } as ContractsVersionsHistorySnapshot
}

export async function persistLatestVersionsSnapshot(params: {
  fileName: string
  snapshot: ContractsVersionsHistorySnapshot
}): Promise<void> {
  const latestVersionsSnapshot = Object.entries(params.snapshot.contracts).reduce(
    (latestVersionsSnapshot, [contractName, historyInfo]) => {
      return {
        ...latestVersionsSnapshot,
        [contractName]: {
          name: contractName,
          path: historyInfo.path,
          latestVersion: historyInfo.latestVersion,
        },
      }
    },
    {
      timestamp: params.snapshot.timestamp,
      date: params.snapshot.date,
    } as ContractsLatestVersionsSnapshot,
  )

  const { dir, name, ext } = path.parse(params.fileName)

  try {
    if (fs.existsSync(params.fileName)) {
      const newFileName = path.join(dir, `${name}.previous${ext}`)
      fs.renameSync(params.fileName, newFileName)
    }
  } catch (error) {
    console.error('Error renaming previous versions snapshot file', error)
  }

  try {
    fs.writeFileSync(params.fileName, JSON.stringify(latestVersionsSnapshot, null, 2))
  } catch (error) {
    console.error('Error persisting new versions snapshot file', error)
  }
}

export async function persistVersionsHistorySnapshot(params: {
  fileName: string
  snapshot: ContractsVersionsHistorySnapshot
}): Promise<void> {
  const { dir, name, ext } = path.parse(params.fileName)

  try {
    if (fs.existsSync(params.fileName)) {
      const newFileName = path.join(dir, `${name}.previous${ext}`)
      fs.renameSync(params.fileName, newFileName)
    }
  } catch (error) {
    console.error('Error renaming previous versions snapshot file', error)
  }

  try {
    fs.writeFileSync(params.fileName, JSON.stringify(params.snapshot, null, 2))
  } catch (error) {
    console.error('Error persisting new versions snapshot file', error)
  }
}

export async function persistContractsVersionsSnapshot(params: {
  latestVersionsFileName: string
  versionsHistoryFileName: string
  snapshot: ContractsVersionsHistorySnapshot
}): Promise<void> {
  await persistLatestVersionsSnapshot({
    fileName: params.latestVersionsFileName,
    snapshot: params.snapshot,
  })

  return persistVersionsHistorySnapshot({
    fileName: params.versionsHistoryFileName,
    snapshot: params.snapshot,
  })
}

export async function updateAndPersistContractsVersionsSnapshot(params: {
  latestVersionsFileName: string
  versionsHistoryFileName: string
}): Promise<{
  neededUpdate: boolean
}> {
  const currentSnapshot = await loadCurrentVersionsSnapshot({
    fileName: params.versionsHistoryFileName,
  })
  const latestSnapshot = await generateVersionsHistorySnapshot({
    currentSnapshot,
  })

  const neededUpdate =
    currentSnapshot === undefined ||
    JSON.stringify(currentSnapshot.contracts) !== JSON.stringify(latestSnapshot.contracts)

  if (neededUpdate) {
    await persistContractsVersionsSnapshot({
      latestVersionsFileName: params.latestVersionsFileName,
      versionsHistoryFileName: params.versionsHistoryFileName,
      snapshot: latestSnapshot,
    })
  }

  return {
    neededUpdate,
  }
}
