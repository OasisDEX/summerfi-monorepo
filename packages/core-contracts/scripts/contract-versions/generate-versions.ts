import { updateContractVersions } from './common'

async function main() {
  const { neededUpdate } = await updateContractVersions()

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
