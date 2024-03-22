import { encodeMakerGiveThroughProxyActions } from '../src/utils/MakerGive'
import yargs from 'yargs/yargs'
import { Hex } from 'viem'

async function main() {
  const args = await yargs(process.argv.slice(2))
    .option('makerProxyActions', {
      alias: 'p',
      description: 'Maker Proxy Actions address',
      type: 'string',
    })
    .option('cdpManager', {
      alias: 'c',
      description: 'Maker CDP Manager address',
      type: 'string',
    })
    .option('cdpId', {
      alias: 'i',
      type: 'number',
    })
    .option('to', {
      alias: 't',
      description: 'Address to give the CDP to',
      type: 'string',
    })
    .demandOption(['makerProxyActions', 'cdpManager', 'cdpId', 'to'])
    .help()
    .alias('help', 'h').argv

  const makerProxyActions = args.makerProxyActions as Hex
  const cdpManager = args.cdpManager as Hex
  const cdpId = args.cdpId.toString()
  const to = args.to as Hex

  console.log(`Maker Proxy Actions: ${makerProxyActions}`)
  console.log(`CDP Manager: ${cdpManager}`)
  console.log(`CDP ID: ${cdpId}`)
  console.log(`To: ${to}\n`)

  const result = encodeMakerGiveThroughProxyActions({ makerProxyActions, cdpManager, cdpId, to })

  console.log(`[Full transaction Calldata]`)
  console.log(`${result.transactionCalldata}\n`)

  console.log(`[DS Proxy Parameters]`)
  console.log(`  Target: ${result.dsProxyParameters.target}`)
  console.log(`  Call Data: ${result.dsProxyParameters.callData}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
