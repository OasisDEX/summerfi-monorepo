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
import { sendAndLogTransactions, TransactionUtils } from '@summerfi/testing-utils'
import type { IArmadaVaultId } from '@summerfi/armada-protocol-common'
import { prepareData } from './utils/prepareData'
import { signerPrivateKey, SDKApiUrl, testConfig, signerAddress } from './utils/testConfig'
import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'

jest.setTimeout(300000)

describe('Armada Protocol Deposit', () => {
  const main = async () => {
    for (const { symbol, swapSymbol, chainInfo, fleetAddress, rpcUrl } of testConfig) {
      console.log(`Running tests for ${symbol} on ${chainInfo.name}`)
      await runTests({ symbol, swapSymbol, chainInfo, fleetAddress, rpcUrl: rpcUrl })
    }
  }
  main()

  async function runTests({
    symbol,
    swapSymbol,
    chainInfo,
    fleetAddress,
    rpcUrl,
  }: {
    chainInfo: ChainInfo
    symbol: string
    swapSymbol: string
    fleetAddress: Address
    rpcUrl: string | undefined
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })

    if (!rpcUrl) {
      throw new Error('Missing fork url')
    }
    const transactionUtils = new TransactionUtils({
      rpcUrl,
      walletPrivateKey: signerPrivateKey,
      chainInfo: chainInfo,
      useFork: process.env.SDK_USE_FORK === 'true',
    })

    let vaultId: IArmadaVaultId
    let token: IToken
    let swapToken: IToken
    let user: IUser

    beforeEach(async () => {
      console.log(`Preparation for ${symbol} on ${chainInfo.name}`)
      const data = await prepareData(symbol, swapSymbol, chainInfo, sdk, signerAddress)
      vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      })
      token = data.token
      swapToken = data.swapToken
      user = data.user
    })

    it('print balances', async () => {
      const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
        vaultId,
        user,
      })
      const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
        vaultId,
        user,
      })
      console.log(
        'fleet balance',
        fleetAmountBefore.shares.toSolidityValue(),
        typeof fleetAmountBefore.shares.toSolidityValue(),
      )
      console.log(
        'fleet assets',
        fleetAmountBefore.assets.toSolidityValue(),
        typeof fleetAmountBefore.assets.toSolidityValue(),
      )
      console.log(
        'staked balance',
        stakedAmountBefore.shares.toSolidityValue(),
        typeof stakedAmountBefore.shares.toSolidityValue(),
      )
      console.log(
        'staked assets',
        stakedAmountBefore.assets.toSolidityValue(),
        typeof stakedAmountBefore.assets.toSolidityValue(),
      )
    })

    it('check max deposit', async () => {
      const maxDeposit = await transactionUtils.publicClient.readContract({
        address: fleetAddress.value,
        abi: FleetCommanderAbi,
        functionName: 'maxDeposit',
        args: [user.wallet.address.value],
      })
      console.log('max deposit', maxDeposit, typeof maxDeposit)
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
            value: 1,
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
          typeof fleetAmountBefore.shares.toSolidityValue(),
          stakedAmountBefore.shares.toSolidityValue(),
          typeof stakedAmountBefore.shares.toSolidityValue(),
        )
        const { statuses } = await sendAndLogTransactions({
          chainInfo,
          transactions,
          rpcUrl: rpcUrl,
          privateKey: signerPrivateKey,
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
          typeof fleetAmountAfter.shares.toSolidityValue(),
          stakedAmountAfter.shares.toSolidityValue(),
          typeof stakedAmountAfter.shares.toSolidityValue(),
          'difference',
          stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
        )
        expect(fleetAmountAfter.shares.toSolidityValue()).toEqual(
          fleetAmountBefore.shares.toSolidityValue(),
        )
        expect(stakedAmountAfter.shares.toSolidityValue()).toBeGreaterThan(
          stakedAmountBefore.shares.toSolidityValue(),
        )
        expect(
          Number(stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).amount),
        ).toBeGreaterThan(0.9)
      })

      it.skip(`should deposit 1 USDC (without stake) to fleet at ${fleetAddress.value}`, async () => {
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
            value: 1,
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
          rpcUrl: rpcUrl,
          privateKey: signerPrivateKey,
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
          Number(fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).amount),
        ).toBeGreaterThan(0.9)
      })

      it.skip(`should deposit and swap 1 ${swapSymbol} (with stake) to fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'
        const transactions = await sdk.armada.users.getNewDepositTX({
          vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token: swapToken,
          }),
          slippage: Percentage.createFrom({
            value: 1,
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
          rpcUrl: rpcUrl,
          privateKey: signerPrivateKey,
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
        ).toBeGreaterThan(0.9)
      })
    })

    describe.skip(`Withdraw on ${chainInfo.name}`, () => {
      it(`should withdraw 1 USDC unstaked assets back from fleet at ${fleetAddress.value}`, async () => {
        const amount = '1'

        // const pre = await sdk.armada.users.getNewDepositTX({
        //   vaultId: vaultId,
        //   user,
        //   amount: TokenAmount.createFrom({
        //     amount,
        //     token: swapToken,
        //   }),
        //   slippage: Percentage.createFrom({
        //     value: 0.01,
        //   }),
        //   shouldStake: false,
        // })
        // await sendAndLogTransactions({
        //   chainInfo,
        //   transactions: pre,
        //   rpcUrl: forkUrl,
        //   privateKey: signerPrivateKey,
        // })

        const transactions = await sdk.armada.users.getWithdrawTX({
          vaultId: vaultId,
          user,
          amount: TokenAmount.createFrom({
            amount,
            token: swapToken,
          }),
          toToken: swapToken,
          slippage: Percentage.createFrom({
            value: 1,
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
          transactions: transactions,
          rpcUrl: rpcUrl,
          privateKey: signerPrivateKey,
        })
        statuses.forEach((status) => {
          expect(status).toBe('success')
        })

        await new Promise((resolve) => {
          console.log('wait 5 seconds...')
          return setTimeout(resolve, 5000)
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
      })
    })
  }
})
