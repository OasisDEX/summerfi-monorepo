// run this file with "pnpx tsx test.ts" from this folder

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRpcGatewayEndpoint, IRpcConfig, ChainId } from '@summerfi/serverless-shared'
import { sparkRewardsAbi } from '../src/abi/rewards'

import { config } from 'dotenv'
config({ path: '../../.env' })

import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  extractChain,
  http,
  type Hex,
} from 'viem'
import { mainnet, base, optimism, arbitrum, sepolia, sonic } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'local',
  source: 'e2e-test',
}

const functionsUrl =
  process.env.FUNCTIONS_API_URL || 'https://v74m7d2hd6.execute-api.eu-central-1.amazonaws.com'

// Ensure the environment variables are set or provide fallback values inline
const rpcGatewayUrl =
  process.env.E2E_SDK_FORK_URL_MAINNET || 'YOUR_MAINNET_RPC_URL_HERE_INFURA_OR_ALCHEMY'
const privateKey = process.env.E2E_USER_PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE_TO_SEND_TRANSACTION'
const account = (process.env.E2E_DPM_ADDRESS || 'DPM_ADDRESS_HERE') as Hex
const cAddress: Hex = '0x9107f5f940226a9f21433f373a4f938228d20e1a'

async function main() {
  if (!functionsUrl) {
    throw new Error('FUNCTIONS_API_URL environment variable is not set')
  }
  if (!rpcGatewayUrl) {
    throw new Error('SDK_RPC_GATEWAY environment variable is not set')
  }
  if (!privateKey) {
    throw new Error('E2E_USER_PRIVATE_KEY environment variable is not set')
  }

  const viemAccount = privateKeyToAccount(privateKey as `0x${string}`)
  const chainId = ChainId.MAINNET // Hardcoded for now, can be extended later
  const rpcUrl = getRpcGatewayEndpoint(rpcGatewayUrl, chainId, rpcConfig)
  const transport = http(rpcUrl, {
    batch: true,
    fetchOptions: {
      method: 'POST',
    },
  })
  const chain = extractChain({
    chains: [mainnet, base, optimism, arbitrum, sepolia, sonic],
    id: chainId,
  })
  const client = createPublicClient({
    chain,
    transport,
    batch: {
      multicall: true,
    },
  })

  const data =
    '0xef98231e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000005e5de48a965fef85e50921d2fa7ebaa35ae3797000000000000000000000000c20059e0317de91738d13af027dfc4a50781b066000000000000000000000000000000000000000000000124bc0ddd92e56000000b90e54808c026feb46dabad594c8e2f6625091d82effa5119ea6059dcc5a97900000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000104a7be0795d8101aa5cd46e489d5e488b7c60bf9ce759eaf3ea263b6e256700186688b0bed82c2543781b937ef30db31491952c60861b4308fdfd0d9cbb5b498ef06f78ff8fd61b5ea33127726d1ed03f9b0d6f4dd896fb2d4a058dbf4104d415f020d853cdea0b92a4b81cfa3c74f2a89fc551ec7c0bf11fb18e81051cf8e53cd0ad8560842918ea9296898783fd9cc5ebd2f067d416b75d8f316e7eadc8a0dc07e0a3641f7bbac30b97aaca0a86b74898e01ac2278ed21563f9662ead51571759538a844541b716e0e782f81aa73b019c555086a670108d394ffa9569681be4dbe2b184ea6f1ee0e7b6526b0b18a0658f8fd7ecc37946f59180e4caaaa96f715768d8656bf197f5afcee518cd4db235fd956fd225423d1b13606d8f9e43127b0a1bcf00f9b820e3c30ca18c23c905e3e0f0857bc49a01b89307188774b9415f166767682f00863c993c32d49eb05b531f83640a2e787e75d08bfe8332e5b514bd2e66e8af83ab63717fa7438cb499ace9a08592f7400f04dca31b152b450a7a4ba440d26592d8f727e94d518ec625b9a06d43b1addd61616b1c476cf1e39dc1bd45a57f5ad072ce4a153f2bd11b1db79b3231f8d665c9fa5306648c1f61bec60721aee7309a3d1fd57188d5d4a2b4b95e79f6b984057f024fa113535dc615fc95c5db1af0922f78a9846d19badd56639b5c1aa461fcda52ba8ae3574848bea0'

  // run simulation to check if the claim is already claimed
  // will fail with Multicall3: call failed.
  const tx = await client.call({
    account: '0x05E5De48A965Fef85E50921d2Fa7eBAa35ae3797',
    to: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d',
    data,
    value: BigInt(0n),
  })
  console.log('Transaction success:', tx.data)

  const wallet = createWalletClient({
    account: viemAccount,
    chain,
    transport,
  })
  const txHash = await wallet.sendTransaction({
    to: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d',
    data,
    value: BigInt(0n),
  })
  console.log('Transaction sent:', txHash)
}

main().catch((err) => {
  console.log('Transaction error:', err.message)
  process.exit(1)
})
