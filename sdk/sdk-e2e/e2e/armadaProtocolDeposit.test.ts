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

    describe.skip(`Deposit on ${chainInfo.name}`, () => {
      it(`should deposit 1 USDC (with stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          fleetAmountBefore.shares.toSolidityValue(),
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

        const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          fleetAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(fleetAmountAfter.shares.toSolidityValue()).toEqual(
          fleetAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount).toBeGreaterThan(
          0.999999,
        )
      })

      it(`should deposit 1 USDC (without stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'

        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId: vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
          shouldStake: false,
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          fleetAmountBefore.shares.toSolidityValue(),
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

        const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          fleetAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(fleetAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          fleetAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toEqual(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(
          Number(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount),
        ).toBeGreaterThan(0.99)
      })

      it(`should deposit and swap 1 ${swapToken.symbol} (with stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token: swapToken,
          }),
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          fleetAmountBefore.shares.toSolidityValue(),
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

        const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          fleetAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(fleetAmountAfter.shares.toSolidityValue()).toEqual(
          fleetAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(
          Number(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount),
        ).toBeGreaterThan(0.99)
      })
    })

    describe(`Withdraw on ${chainInfo.name}`, () => {
      it(`should withdraw 0.99 USDC back from fleet at ${fleetAddress.value}`, async () => {
        const amount = '0.99'

        const transactions = await sdk.armada.users.getWithdrawTX({
          vaultId: vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token,
          }),
          slippage: Percentage.createFrom({
            value: 0.01,
          }),
        })

        const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'before',
          fleetAmountBefore.shares.toSolidityValue(),
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

        const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
          vaultId,
          user,
        })
        const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
          vaultId,
          user,
        })
        console.log(
          'after',
          fleetAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
        )
        expect(fleetAmountAfter.shares.toSolidityValue()).toEqual(
          fleetAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toEqual(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(
          Number(stakedAmountBefore.assets.subtract(stakedAmountAfter.assets).amount),
        ).toBeGreaterThan(0.99)
      })
    })
  }
})
