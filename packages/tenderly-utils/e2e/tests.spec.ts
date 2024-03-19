import { input, rawlist } from '@inquirer/prompts'
import * as Tenderly from '../src/tenderly'
import * as Utils from '../src/utils'

type Tokens = 'CBETH' | 'DAI' | 'ETH' | 'USDC' | 'RETH' | 'SDAI' | 'WBTC' | 'WSTETH'

let walletAddress: string
;(async () => {
  const network: 'mainnet' | 'optimism' | 'arbitrum' | 'base' = await rawlist({
    message: 'Select a network',
    choices: [
      { name: 'Mainnet', value: 'mainnet' },
      { name: 'Arbitrum', value: 'arbitrum' },
      { name: 'Base', value: 'base' },
      { name: 'Optimism', value: 'optimism' },
    ],
  })

  const tokens = Object.keys(Utils.tokenAddresses[network]) as Tokens[]

  const resp = await Tenderly.createFork({ network })
  const forkId = resp.data.root_transaction.fork_id

  walletAddress = await input({ message: 'Enter your wallet address: ' })

  await Tenderly.setETHBalance({
    forkId,
    balance: Utils.tokenBalances['ETH'],
    walletAddress: walletAddress,
  })

  for (const token of tokens) {
    await Tenderly.setERC20TokenBalance({
      forkId,
      network,
      token,
      balance: Utils.tokenBalances[token],
      walletAddress: walletAddress,
    })
  }

  console.log(`Selected network: ${network}`)
  console.log(`Wallet address: ${walletAddress}`)
  console.log('-------------------------------------')
  console.log('*** FUNDS ***')
  console.log(`ETH - ${Utils.tokenBalances['ETH']}`)
  tokens.forEach((token) => {
    console.log(`${token} - ${Utils.tokenBalances[token]}`)
  })
  console.log('-------------------------------------')
  console.log('Fork created: ', `https://rpc.tenderly.co/fork/${forkId}`)

  await Tenderly.deleteFork(forkId)
  console.log('Fork removed: ', `https://rpc.tenderly.co/fork/${forkId}`)
})()
