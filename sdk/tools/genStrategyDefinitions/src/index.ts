import {
  generateDebugDefinitions,
  generateOperationDefinitions,
  generateSafeMultisendJSON,
  processStrategies,
} from './Helpers'
import yargs from 'yargs'
import fs from 'fs'
import { refinanceLendingToLendingAnyPairStrategy } from '@summerfi/simulator-service/strategies'
import { AddressValue } from '@summerfi/sdk-common'

async function main() {
  const args = await yargs(process.argv.slice(2))
    .option('output', {
      alias: 'o',
      description: 'Output file path',
      type: 'string',
    })
    .option('safe', {
      alias: 's',
      description: 'Address of the Safe multisig',
      type: 'string',
    })
    .option('registry', {
      alias: 'r',
      description: 'Address of the Operations Registry',
      type: 'string',
    })
    .option('format', {
      alias: 'f',
      description: 'Output format (safe, tenderly, debug)',
      default: 'safe',
      type: 'string',
    })
    .demandOption(['output', 'safe', 'registry'])
    .help()
    .alias('help', 'h').argv

  const strategyDefinitions = processStrategies([refinanceLendingToLendingAnyPairStrategy])

  const operationDefinitions = generateOperationDefinitions('Refinance', strategyDefinitions)

  const safeBatch = generateSafeMultisendJSON(
    args.safe as AddressValue,
    args.registry as AddressValue,
    operationDefinitions,
  )

  if (args.output) {
    console.log(`Writing to ${args.output}`)

    // Write to file
    if (args.format === 'safe') {
      fs.writeFileSync(args.output, JSON.stringify(safeBatch, null, 2))
    } else if (args.format === 'tenderly') {
      fs.writeFileSync(args.output, JSON.stringify(operationDefinitions, null, 2))
    } else {
      const debugDefinitions = generateDebugDefinitions('Refinance', strategyDefinitions)

      fs.writeFileSync(args.output, JSON.stringify(debugDefinitions, null, 2))
    }
  } else {
    console.log('--------------------')
    console.log(JSON.stringify(strategyDefinitions, null, 2))
    console.log('--------------------')
  }

  console.log(`Strategy Definitions (${operationDefinitions.length})`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
