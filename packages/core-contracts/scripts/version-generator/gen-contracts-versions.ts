import { updateAndPersistContractsVersionsSnapshot } from './utils'

const LatestContractsVersionsFileName = 'versions/contracts-versions.latest.json'
const ContractsVersionsHistoryFileName = 'versions/contracts-versions.history.json'

async function main() {
  const { neededUpdate } = await updateAndPersistContractsVersionsSnapshot({
    latestVersionsFileName: LatestContractsVersionsFileName,
    versionsHistoryFileName: ContractsVersionsHistoryFileName,
  })

  if (neededUpdate) {
    console.log('Contracts versions snapshot updated')
  } else {
    console.log('Contracts versions have not changed, not updating')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
