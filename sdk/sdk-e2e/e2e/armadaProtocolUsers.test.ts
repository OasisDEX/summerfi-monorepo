import { isAddress } from 'viem/utils'

import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ChainFamilyMap,
  TokenAmount,
  User,
  Wallet,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'

import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import type { IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { prepareData } from './prepareData'

jest.setTimeout(300000)

/** TEST CONFIG */
const SDKApiUrl = process.env.E2E_SDK_API_URL,
  walletAddress = process.env.E2E_USER_ADDRESS,
  privateKey = process.env.E2E_USER_PRIVATE_KEY,
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

const testConfig = [
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

describe('Armada Protocol Users', () => {
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

  for (const { symbol, chainInfo, fleetAddress, forkUrl, userAddress } of testConfig) {
    if (!forkUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Deposit/Withdraw with ${symbol} fleet on ${chainInfo.name}`, () => {
      let poolId: IArmadaVaultId
      let token: IToken
      let user: IUser

      beforeEach(async () => {
        const data = await prepareData(symbol, chainInfo, sdk, walletAddress)
        poolId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress,
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

    describe(`Positions on ${chainInfo.name}`, () => {
      const user = User.createFrom({
        chainInfo,
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
      })
      it('should getUserPositions', async () => {
        const positions = await sdk.armada.users.getUserPositions({
          user,
        })
        expect(positions).toHaveLength(1)
        expect(positions[0].id.id).toEqual(`${userAddress.value}-${fleetAddress.value}`)
      })

      it('should getUserPosition', async () => {
        const position = await sdk.armada.users.getUserPosition({
          user,
          fleetAddress,
        })
        expect(position.id.id).toEqual(`${userAddress.value}-${fleetAddress.value}`)
      })
    })

    describe.only(`Vaults on ${chainInfo.name}`, () => {
      it('should getVaults', async () => {
        const raw = await sdk.armada.users.getVaultsRaw({
          chainInfo,
        })
        expect(raw.vaults).toHaveLength(1)
        expect(raw.vaults[0]?.id).toEqual(`${fleetAddress.value}`)
      })

      it('should getVault', async () => {
        const raw = await sdk.armada.users.getVaultRaw({
          poolId: ArmadaVaultId.createFrom({
            chainInfo,
            fleetAddress,
          }),
        })
        expect(raw.vault?.id).toEqual(`${fleetAddress.value}`)
      })
    })
  }
})
