import { ArmadaVaultId, makeSDK } from '@summerfi/sdk-client'
import {
  Address,
  ChainFamilyMap,
  getChainFamilyInfoByChainId,
  User,
  Wallet,
} from '@summerfi/sdk-common'

// usage:
// pnpm speed-test [ChainId] [WalletAddress] [FleetAddress]
// Make sure you have `bun` installed globally

const [chainIdParam, walletAddressParam, fleetAddressParam] = process.argv.slice(2)

const chainInfo = getChainFamilyInfoByChainId(Number(chainIdParam)).chainInfo

if (!chainInfo) {
  throw new Error(`Invalid chainId: ${chainIdParam}`)
}

if (!walletAddressParam) {
  throw new Error('Wallet address is required')
}
if (!fleetAddressParam) {
  throw new Error('Fleet address is required')
}

console.log(`[SDK Speed test] ${chainInfo.name}`)
const sdkTestStartTime = Date.now()

// Helpers
const stringifyWithBigInt = (_: string, v: unknown) => (typeof v === 'bigint' ? v.toString() : v)

// Config
const sdk = makeSDK({
  apiURL: `${process.env.SDK_API_URL}/api/sdk`,
})

const wallet = Wallet.createFrom({
  address: Address.createFromEthereum({
    value: walletAddressParam.toLowerCase(),
  }),
})

const userMainnet = User.createFrom({
  chainInfo,
  wallet,
})

const fleetAddress = Address.createFromEthereum({
  value: fleetAddressParam.toLowerCase(),
})

const poolId = ArmadaVaultId.createFrom({
  chainInfo,
  fleetAddress,
})

// Test function to measure speed of SDK calls
const testSDKEndpointSpeed = async (callName: string, callFunction: () => Promise<unknown>) => {
  const callLog = []
  const callTimes: number[] = []

  for (let i = 0; i < 3; i++) {
    // running each test 3 times
    const startTime = Date.now()
    try {
      const res = await callFunction()
      try {
        JSON.stringify(res, stringifyWithBigInt) // if it's stringifiable, I assume it's okay
      } catch (e) {
        console.log(`Response from ${callName} (cannot stringify):`, res)
      }
    } catch (e) {
      console.error(`Error in ${callName}:`, e)
      throw e
    } finally {
      const endTime = Date.now()
      const duration = endTime - startTime
      callTimes.push(duration)
      callLog.push(`${duration}ms`)
    }
  }

  const meanTime = callTimes.reduce((a, b) => a + b, 0) / callTimes.length
  console.log(
    `[SDK Speed test] Call times for ${callName}: ${callLog.join(', ')}, mean time: ${meanTime.toFixed(2)}ms`,
  )
}

// Test getUserPositions
await testSDKEndpointSpeed('getUserPositions', async () => {
  return await sdk.armada.users.getUserPositions({
    user: userMainnet,
  })
})

// Test getVaultRaw
await testSDKEndpointSpeed('getVaultRaw', async () => {
  return await sdk.armada.users.getVaultRaw({
    vaultId: poolId,
  })
})

// Test getMigratablePositions
await testSDKEndpointSpeed('getMigratablePositions', async () => {
  return await sdk.armada.users.getMigratablePositions({
    user: userMainnet,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })
})

// Test getSummerToken
await testSDKEndpointSpeed('getSummerToken', async () => {
  return await sdk.armada.users.getSummerToken({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  })
})

// Test getAggregatedRewards
await testSDKEndpointSpeed('getAggregatedRewards', async () => {
  return await sdk.armada.users.getAggregatedRewards({
    user: userMainnet,
  })
})

// Test getClaimableAggregatedRewards
await testSDKEndpointSpeed('getClaimableAggregatedRewards', async () => {
  return await sdk.armada.users.getClaimableAggregatedRewards({
    user: userMainnet,
  })
})

console.log(`[SDK Speed test] Total time: ${Date.now() - sdkTestStartTime}ms`)
