import { isAddress } from 'viem/utils'

import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ChainFamilyMap,
  TokenAmount,
  User,
  Wallet,
  type ChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'

import { ArmadaPoolId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import type { IArmadaPoolId } from '@summerfi/armada-protocol-common'

jest.setTimeout(300000)

/** TEST CONFIG */
const SDKApiUrl = process.env.E2E_SDK_API_URL,
  walletAddress = process.env.E2E_USER_ADDRESS,
  privateKey = process.env.E2E_USER_PRIVATE_KEY,
  fleetOnBase = Address.createFromEthereum({
    value: '0xd555F7D124a58617f49894b623b97Bf295674f14',
  }),
  fleetOnArb = Address.createFromEthereum({
    value: '0x4774d1cD62D20c288dFAdEfDEDF79d5B4cae1856',
  }),
  forkOnBase = process.env.E2E_SDK_FORK_URL_BASE,
  forkOnArb = process.env.E2E_SDK_FORK_URL_ARBITRUM

const testConfig = [
  {
    symbol: 'USDC',
    fleetAddress: fleetOnBase,
    chainInfo: ChainFamilyMap.Base.Base,
    forkUrl: forkOnBase,
  },
  {
    symbol: 'USDC.e',
    fleetAddress: fleetOnArb,
    chainInfo: ChainFamilyMap.Arbitrum.ArbitrumOne,
    forkUrl: forkOnArb,
  },
]

describe('Armada Protocol Integration', () => {
  if (!SDKApiUrl) {
    throw new Error('Missing E2E_SDK_API_URL')
  }
  if (!isAddress(walletAddress!)) {
    throw new Error('Missing E2E_USER_ADDRESS')
  }
  if (!privateKey) {
    throw new Error('Missing E2E_USER_PRIVATE_KEY')
  }

  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

  for (const { symbol, chainInfo, fleetAddress, forkUrl } of testConfig) {
    if (!forkUrl) {
      throw new Error('Missing fork url')
    }
    // prepare
    describe(`should test ${fleetAddress} fleet on ${chainInfo.name}`, () => {
      let poolId: IArmadaPoolId
      let token: IToken
      let user: IUser

      beforeEach(async () => {
        const data = await prepareData(symbol, chainInfo, forkUrl, sdk, walletAddress)
        poolId = ArmadaPoolId.createFrom({
          chainInfo,
          fleetAddress,
          protocol: data.protocol,
        })
        token = data.token
        user = data.user
      })

      it(`should deposit 1 USDC to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          poolId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          forkUrl,
          privateKey,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })

      it(`should withdraw 0.99 USDC back from fleet at ${fleetAddress.value}`, async () => {
        const amount = '0.99'

        const transactions = await sdk.armada.users.getWithdrawTX({
          poolId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          forkUrl,
          privateKey,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })
    })
  }
})

async function prepareData(
  symbol: string,
  chainInfo: ChainInfo,
  forkUrl: string,
  sdk: SDKManager,
  walletAddress: string,
) {
  const protocol = ArmadaProtocol.createFrom({ chainInfo })
  const user = User.createFrom({
    wallet: Wallet.createFrom({
      address: Address.createFromEthereum({ value: walletAddress }),
    }),
    chainInfo,
  })

  const chain = await sdk.chains.getChain({ chainInfo })
  const token = await chain.tokens.getTokenBySymbol({ symbol })

  return { chain, token, user, protocol }
}
