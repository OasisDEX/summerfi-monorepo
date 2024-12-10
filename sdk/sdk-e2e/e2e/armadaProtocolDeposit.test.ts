import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Percentage,
  TokenAmount,
  type Address,
  type ChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'

import { ArmadaVaultId } from '@summerfi/armada-protocol-service'
import { sendAndLogTransactions } from '@summerfi/testing-utils'
import type { IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { prepareData } from './utils/prepareData'
import { signerPrivateKey, SDKApiUrl, testConfig, signerAddress } from './utils/testConfig'

jest.setTimeout(300000)

const useRpcGateway = true

describe('Armada Protocol Deposit', () => {
  const main = async () => {
    for (const { symbol, chainInfo, fleetAddress, forkUrl } of testConfig) {
      console.log(`Running tests for ${symbol} on ${chainInfo.name}`)
      await runTests({ symbol, chainInfo, fleetAddress, forkUrl })
    }
  }
  main()

  async function runTests({
    symbol,
    chainInfo,
    fleetAddress,
    forkUrl,
  }: {
    chainInfo: ChainInfo
    symbol: string
    fleetAddress: Address
    forkUrl: string | undefined
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })

    if (!forkUrl) {
      throw new Error('Missing fork url')
    }

    let vaultId: IArmadaVaultId
    let token: IToken
    let swapToken: IToken
    let user: IUser

    beforeEach(async () => {
      console.log(`Preparation for ${symbol} on ${chainInfo.name}`)

      const data = await prepareData(symbol, chainInfo, sdk, signerAddress)
      vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      })
      token = data.token
      swapToken = data.swapToken
      user = data.user
    })

    describe.skip(`Deposit with stake on ${chainInfo.name}`, () => {
      it(`should approve and deposit 1 USDC (with stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId,
          user,
          assets: TokenAmount.createFrom({
            amount,
            token,
          }),
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const tokenAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          tokenAmountBefore.shares.toSolidityValue(),
          stakedAmountBefore.shares.toSolidityValue(),
        )
        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: forkUrl,
          privateKey: signerPrivateKey,
          useRpcGateway,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        const tokenAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          tokenAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(tokenAmountAfter.shares.toSolidityValue()).toEqual(
          tokenAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount).toBeGreaterThan(
          0.999999,
        )
      })
    })

    describe(`Deposit and Swap with stake on ${chainInfo.name}`, () => {
      it(`should approve and deposit 1 USDC (with stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId,
          user,
          assets: TokenAmount.createFrom({
            amount,
            token: swapToken,
          }),
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const tokenAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          tokenAmountBefore.shares.toSolidityValue(),
          stakedAmountBefore.shares.toSolidityValue(),
        )
        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: forkUrl,
          privateKey: signerPrivateKey,
          useRpcGateway,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        const tokenAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          tokenAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(tokenAmountAfter.shares.toSolidityValue()).toEqual(
          tokenAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(
          Number(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount),
        ).toBeGreaterThan(0.99)
      })
    })

    describe.skip(`Deposit without stake on ${chainInfo.name}`, () => {
      it(`should approve, deposit 1 USDC (without stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'

        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId: vaultId,
          user,
          assets: TokenAmount.createFrom({
            amount,
            token,
          }),
          shouldStake: false,
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: forkUrl,
          privateKey: signerPrivateKey,
          useRpcGateway,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })

      it(`should withdraw 0.99 USDC back from fleet at ${fleetAddress.value}`, async () => {
        const amount = '0.99'

        const transactions = await sdk.armada.users.getWithdrawTX({
          vaultId: vaultId,
          user,
          assets: TokenAmount.createFrom({
            amount,
            token,
          }),
        })

        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: forkUrl,
          privateKey: signerPrivateKey,
          useRpcGateway,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })
      })
    })
  }
})
