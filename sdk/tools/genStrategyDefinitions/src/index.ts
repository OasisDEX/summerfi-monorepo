import { processStrategies, processStrategy } from './Helpers'
import { StrategyIndex } from '@summerfi/simulator-service/strategies/StrategyIndex'
import { StrategyDefinitions } from './Types'
import yargs from 'yargs'
import fs from 'fs'

async function main() {
  const args = await yargs(process.argv.slice(2))
    .option('output', {
      alias: 'o',
      description: 'Output file path',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv

  const strategyDefinitions = processStrategies(StrategyIndex)

  if (args.output) {
    console.log(`Writing to ${args.output}`)

    // Write to file
    fs.writeFileSync(args.output, JSON.stringify(strategyDefinitions, null, 2))
  } else {
    console.log('--------------------')
    console.log(JSON.stringify(strategyDefinitions, null, 2))
    console.log('--------------------')
    console.log(`Strategy Definitions (${strategyDefinitions.length})`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
