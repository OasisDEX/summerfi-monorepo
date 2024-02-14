import { ContractsInfoMap, getContractsInfo } from '@summerfi/contracts-utils'
import { ContractsVersionsMap, ContractsVersionsSnapshot } from './types'
import fs from 'fs'
import path from 'path'
import {
  ContractsVersionsDefaultName,
  SnapshotDirectory,
  SnapshotNameExtension,
  SnapshotTagDelimiter,
  SnapshotTrailingTag,
} from './constants'

const EmptyVersionSnapshot: ContractsVersionsSnapshot = {
  timestamp: 0,
  date: '',
  contracts: {},
}

function getSnapshotFilename(snapshotName: string): string {
  return `${snapshotName}${SnapshotTagDelimiter}${SnapshotTrailingTag}.${SnapshotNameExtension}`
}

function getPreviousSnapshotFilename(snapshotName: string): string {
  return `${snapshotName}${SnapshotTagDelimiter}${SnapshotTrailingTag}.previous.${SnapshotNameExtension}`
}

function checkIfNeedsUpdate(params: {
  currentVersionsSnapshot: ContractsVersionsSnapshot
  previousVersionsSnapshot?: ContractsVersionsSnapshot
}) {
  const previousVersionsSnapshot = params.previousVersionsSnapshot

  if (previousVersionsSnapshot === undefined) {
    return true
  }

  return Object.entries(params.currentVersionsSnapshot.contracts).some(
    ([contractName, currentVersionInfo]) => {
      return (
        previousVersionsSnapshot.contracts[contractName]?.latestHash !==
        currentVersionInfo.latestHash
      )
    },
  )
}

export function loadVersionsSnapshot(
  params: {
    snapshotName?: string
    snapshotDir?: string
  } = {},
): ContractsVersionsSnapshot | undefined {
  try {
    const snapshotName = getSnapshotFilename(params.snapshotName ?? ContractsVersionsDefaultName)
    const filePath = path.join(params.snapshotDir ?? SnapshotDirectory, snapshotName)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    return undefined
  }
}

function generateCurrentSnapshot(params: {
  contractsInfo: ContractsInfoMap
}): ContractsVersionsSnapshot {
  const contracts = Object.entries(params.contractsInfo).reduce(
    (contractsVersions, [contractName, contractInfo]) => {
      return {
        ...contractsVersions,
        [contractName]: {
          name: contractName,
          path: contractInfo.path,
          latestVersion: 0,
          latestHash: contractInfo.hash,
          latestAbi: contractInfo.executeAbi,
        },
      }
    },
    {} as ContractsVersionsMap,
  )

  return {
    timestamp: Date.now(),
    date: new Date().toISOString(),
    contracts: contracts,
  } as ContractsVersionsSnapshot
}

function updateVersionsSnapshot(params: {
  currentVersionsSnapshot: ContractsVersionsSnapshot
  previousVersionsSnapshot?: ContractsVersionsSnapshot
}): ContractsVersionsSnapshot {
  const versionsSnapshot = params.previousVersionsSnapshot ?? EmptyVersionSnapshot

  for (const [contractName, currentVersionInfo] of Object.entries(
    params.currentVersionsSnapshot.contracts,
  )) {
    const isContractUpdated =
      versionsSnapshot.contracts[contractName]?.latestHash !== currentVersionInfo.latestHash

    const currentVersion = versionsSnapshot.contracts[contractName]?.latestVersion ?? 0
    const latestVersion = isContractUpdated ? currentVersion + 1 : currentVersion
    const versionHistory = versionsSnapshot.contracts[contractName]?.history ?? []

    versionsSnapshot.contracts[contractName] = {
      name: contractName,
      path: currentVersionInfo.path,
      latestVersion: latestVersion,
      latestHash: currentVersionInfo.latestHash,
      history: [
        {
          version: latestVersion,
          hash: currentVersionInfo.latestHash,
          abi: currentVersionInfo.latestAbi,
        },
        ...versionHistory,
      ],
    }
  }

  versionsSnapshot.timestamp = Date.now()
  versionsSnapshot.date = new Date().toISOString()

  return versionsSnapshot
}

function persistVersionsSnapshot(params: {
  snapshotsDir: string
  snapshotName: string
  snapshot: ContractsVersionsSnapshot
}): void {
  const filePath = path.join(params.snapshotsDir, getSnapshotFilename(params.snapshotName))
  try {
    if (fs.existsSync(filePath)) {
      const newFilePath = path.join(
        params.snapshotsDir,
        getPreviousSnapshotFilename(params.snapshotName),
      )
      fs.renameSync(filePath, newFilePath)
    }
  } catch (error) {
    console.error('Error renaming previous versions snapshot file', error)
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(params.snapshot, null, 2))
  } catch (error) {
    console.error('Error persisting new versions snapshot file', error)
  }
}

export async function updateContractVersions(
  params: {
    snapshotsDir?: string
    snapshotName?: string
  } = {},
): Promise<{
  neededUpdate: boolean
}> {
  const snapshotsDir = params.snapshotsDir ?? SnapshotDirectory
  const snapshotName = params.snapshotName ?? ContractsVersionsDefaultName

  const contractsInfo = await getContractsInfo({
    exclusions: ['interfaces', '@openzeppelin', '@prb', 'test', 'hardhat'],
  })

  const currentVersionsSnapshot = generateCurrentSnapshot({
    contractsInfo,
  })

  const previousVersionsSnapshot = loadVersionsSnapshot({
    snapshotName,
  })

  const neededUpdate = checkIfNeedsUpdate({ currentVersionsSnapshot, previousVersionsSnapshot })
  if (neededUpdate) {
    const snapshot = updateVersionsSnapshot({
      currentVersionsSnapshot,
      previousVersionsSnapshot,
    })

    persistVersionsSnapshot({
      snapshotsDir,
      snapshotName,
      snapshot,
    })
  }

  return {
    neededUpdate,
  }
}
