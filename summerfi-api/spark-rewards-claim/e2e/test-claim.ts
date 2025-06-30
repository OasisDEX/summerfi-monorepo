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
const userAccount = (process.env.E2E_DPM_ADDRESS || 'DPM_ADDRESS_HERE') as Hex

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

  const signerAccount = privateKeyToAccount(privateKey as `0x${string}`)
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

  // run simulation to check if the claim is already claimed
  // will fail with Multicall3: call failed.
  const tx = await client.call({
    account: signerAccount.address,
    to: '0xCBA0C0a2a0B6Bb11233ec4EA85C5bFfea33e724d',
    data: encodeFunctionData({
      abi: sparkRewardsAbi,
      functionName: 'claim',
      args: [
        1n,
        userAccount,
        '0xc20059e0317de91738d13af027dfc4a50781b066', // token
        5400000000000000000000n,
        '0x0b90e54808c026feb46dabad594c8e2f6625091d82effa5119ea6059dcc5a979',
        [
          '0xe3abe68b4dcf6ae3847b506224b2f2799c13e1c76b05631b785c32e050345c49',
          '0x414c6d1870575a171f16e83c0e865066cb5e3b0db058c450fd647f6c6ba2c93b',
          '0xdcaaedafb7e521350e6c31a6458d964ed0f97626bc703765d2890bca111d6f91',
          '0x41bdb1f613806012efc4912895b5aceb8997db1e498a59a8703df9cb111d2705',
          '0x61f0d5466ba07da7ea112f9c5308c0bbdc06e590a458cc692f572b8f2f2fe1e7',
          '0xcb483ae4b66ecdbdacaaa595b3d3b82ebf9cea4dc5042084b85ab5839ff0892e',
          '0xf7dd75db050a6a1a3890265ee1e4139dbdfe0a9592b21cc98d5ee4f15f2d7cac',
          '0xb6f2f0ee72d24f399de14795bb8823f474e6f42af1024f839707cae884998d2b',
          '0x7099a0701fcce605db6daf3765947631a975f56902018a21b7dbf4b47275fcf2',
          '0xcf6617e06b6d902c3830e89a2984d10e909b9389e712bd8c45ed728d2bccdbd3',
          '0xe11e1171dd5628d7944922a3c36cc8fde6f7eba717eb2b1bca56895aa753d250',
          '0x1b3146ef9838d8be4ece83b8a2fc6e2bee145000d4b86efcd325d2aa86d985b0',
          '0xb2b87f2b9823b03552ce1566a82025b9960fdde30c40866904ec2daedb3e6e29',
          '0xba87f471dfa9f63f897bbaaf0f50a1e35b189b5d8f08e78bad3e5630efc41e9f',
          '0x08146e9e13a234a0b58c3f10e5c62fe700b1d1e39c4167f5449d52f4d41c3a95',
        ],
      ],
    }),
    value: BigInt(0n),
  })
  console.log('Transaction success:', tx.data)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const wallet = createWalletClient({
    account: signerAccount,
    chain,
    transport,
  })
  // const txHash = await wallet.sendTransaction({
  //   to: claim.to,
  //   data: claim.data,
  //   value: BigInt(claim.value),
  // })
  // console.log('Transaction sent:', txHash)
}

main().catch((err) => {
  console.log('Transaction error:', err.message)
  process.exit(1)
})
