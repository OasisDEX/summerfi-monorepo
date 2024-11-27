import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import { TokenAmount, type IToken, type IUser } from '@summerfi/sdk-common'

import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import type { IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { prepareData } from './utils/prepareData'
import { signerPrivateKey, SDKApiUrl, testConfig, signerAddress } from './utils/testConfig'

jest.setTimeout(300000)

describe('Armada Protocol Deposit', () => {
  const sdk: SDKManager = makeSDK({
    apiURL: SDKApiUrl,
  })

  for (const { symbol, chainInfo, fleetAddress, forkUrl } of testConfig) {
    if (!forkUrl) {
      throw new Error('Missing fork url')
    }

    describe(`Deposit/Withdraw with ${symbol} fleet on ${chainInfo.name}`, () => {
      let poolId: IArmadaVaultId
      let token: IToken
      let user: IUser

      beforeEach(async () => {
        const data = await prepareData(symbol, chainInfo, sdk, signerAddress)
        poolId = ArmadaVaultId.createFrom({
          chainInfo,
          fleetAddress,
        })
        token = data.token
        user = data.user
      })

      it(`should approve, deposit 1 USDC (with stake) to fleet at ${fleetAddress.value}`, async () => {
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
          privateKey: signerPrivateKey,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })

      it(`should approve, deposit 1 USDC (without stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'

        const transactions = await sdk.armada.users.getNewDepositTX({
          poolId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
          shouldStake: false,
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          forkUrl,
          privateKey: signerPrivateKey,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })

      // it(`should withdraw 0.99 USDC back from fleet at ${fleetAddress.value}`, async () => {
      //   const amount = '0.99'

      //   const transactions = await sdk.armada.users.getWithdrawTX({
      //     poolId,
      //     user,
      //     amount: TokenAmount.createFrom({
      //       amount,
      //       token,
      //     }),
      //   })

      //   const { statuses } = await sendAndLogTransactions({
      //     chainInfo,
      //     transactions,
      //     forkUrl,
      //     privateKey: signerPrivateKey,
      //   })
      //   statuses.forEach((status) => {
      //     expect(status).toBe('success')
      //   })
      // })
    })
  }
})
