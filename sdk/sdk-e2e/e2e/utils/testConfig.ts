import { Address, ChainFamilyMap } from '@summerfi/sdk-common'
if (!process.env.E2E_SDK_API_URL) {
  throw new Error('Missing E2E_SDK_API_URL')
}
if (!process.env.E2E_USER_ADDRESS!) {
  throw new Error('Missing E2E_USER_ADDRESS')
}
if (!process.env.E2E_USER_PRIVATE_KEY) {
  throw new Error('Missing E2E_USER_PRIVATE_KEY')
}

/** TEST CONFIG */
export const SDKApiUrl = process.env.E2E_SDK_API_URL,
  signerAddress = process.env.E2E_USER_ADDRESS,
  signerPrivateKey = process.env.E2E_USER_PRIVATE_KEY,
  fleetOnBase = Address.createFromEthereum({
    value: '0xd555f7d124a58617f49894b623b97bf295674f14',
  }),
  fleetOnArb = Address.createFromEthereum({
    value: '0x4774d1cd62d20c288dfadefdedf79d5b4cae1856',
  }),
  userOnBase = Address.createFromEthereum({
    value: '0xe9c245293dac615c11a5bf26fcec91c3617645e4',
  }),
  userOnArb = Address.createFromEthereum({
    value: '0xe9c245293dac615c11a5bf26fcec91c3617645e4',
  }),
  forkOnBase = process.env.E2E_SDK_FORK_URL_BASE,
  forkOnArb = process.env.E2E_SDK_FORK_URL_ARBITRUM

export const testConfig = [
  {
    chainInfo: ChainFamilyMap.Base.Base,
    symbol: 'USDC',
    fleetAddress: fleetOnBase,
    forkUrl: forkOnBase,
    userAddress: userOnBase,
  },
  {
    chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
    symbol: 'USDC.e',
    fleetAddress: fleetOnArb,
    forkUrl: forkOnArb,
    userAddress: userOnArb,
  },
]
