import { loadVersionsSnapshot } from './common'

async function main() {
  const snapshot = loadVersionsSnapshot()
  if (snapshot === undefined) {
    console.error('No snapshot found')
    process.exit(1)
  }

  console.log('-----------------------------')
  console.log('     CONTRACTS VERSIONS')
  console.log('-----------------------------')
  console.log('Snapshot Date:', snapshot.date)
  console.log('Snapshot Timestamp:', snapshot.timestamp)
  console.log('-----------------------------')

  for (const contract of Object.values(snapshot.contracts)) {
    console.log(contract.name)
    console.log('  Version:', contract.latestVersion)
    console.log('  Hash:', contract.latestHash)
    console.log('')
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
