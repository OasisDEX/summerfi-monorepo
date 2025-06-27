// run this file with "pnpx tsx test.ts" from this folder

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRpcGatewayEndpoint, IRpcConfig, ChainId } from '@summerfi/serverless-shared'

import { config } from 'dotenv'
config({ path: '../../.env' })

import { createPublicClient, createWalletClient, extractChain, http } from 'viem'
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
const account = process.env.E2E_DPM_ADDRESS || 'DPM_ADDRESS_HERE'

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
  const wallet = createWalletClient({
    account: viemAccount,
    chain,
    transport,
  })
  const client = createPublicClient({
    chain,
    transport,
    batch: {
      multicall: true,
    },
  })

  const res = await fetch(functionsUrl + '/api/spark-rewards-claim?account=' + account)

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`)
  }

  const json: any = await res.json()
  const claim = json.claimMulticallTransaction
  if (!claim) {
    throw new Error('No claim transaction found in the response')
  }

  // run simulation to check if the claim is already claimed
  // will fail with Multicall3: call failed.
  const tx = await client.call({
    account: viemAccount.address,
    to: claim.to,
    data: claim.data,
    value: BigInt(claim.value),
  })
  console.log('Transaction success:', tx.data)

  // not failed so we can send the transaction
  const txHash = await wallet.sendTransaction({
    to: claim.to,
    data: claim.data,
    value: BigInt(claim.value),
  })
  console.log('Transaction sent:', txHash)
}

main().catch((err) => {
  console.log('Transaction error:', err.message)
  process.exit(1)
})
