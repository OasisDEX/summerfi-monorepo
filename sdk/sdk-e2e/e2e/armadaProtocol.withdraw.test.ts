import {
  Address,
  ArmadaVaultId,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  type AddressValue,
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, TestConfigs } from './utils/testConfig'
import { createTestSDK } from './utils/sdkInstance'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const simulateOnly = true

describe('Armada Protocol Withdraw', () => {
  it('should withdraw from fleet', async () => {
    const { rpcUrl, chainId, fleetAddress, userAddress, symbol } = TestConfigs.SelfManaged

    const amountValue = '0.5'
    const swapToSymbol = undefined

    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      amountValue,
      symbol,
      swapToSymbol,
    })
  })

  async function runTests({
    chainId,
    symbol,
    swapToSymbol,
    fleetAddress,
    rpcUrl,
    amountValue,
    userAddress,
  }: {
    chainId: ChainId
    symbol: string
    swapToSymbol: string | undefined
    fleetAddress: string
    rpcUrl: string
    amountValue: string
    userAddress: AddressValue
  }) {
    const sdk = createTestSDK()

    const chainInfo = getChainInfoByChainId(chainId)

    const user = User.createFromEthereum(chainId, userAddress)

    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
    })

    const token = await sdk.tokens.getTokenBySymbol({ chainId, symbol })
    const swapToken = swapToSymbol
      ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: swapToSymbol })
      : undefined

    const fleetAmountBefore = await sdk.armada.users.getFleetBalance({
      vaultId,
      user,
    })
    const stakedAmountBefore = await sdk.armada.users.getStakedBalance({
      vaultId,
      user,
    })

    console.log(
      'assets before:',
      '\n - wallet',
      fleetAmountBefore.assets.toSolidityValue(),
      '\n - staked',
      stakedAmountBefore.assets.toSolidityValue(),
    )

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: token,
    })

    console.log(`withdraw ${amount.toString()} assets back from fleet at ${fleetAddress}`)

    const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
    assert(
      totalAssetsBefore.toSolidityValue() >= amount.toSolidityValue(),
      `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
    )

    const transactions = await sdk.armada.users.getWithdrawTx({
      vaultId,
      user,
      amount,
      toToken: swapToken || token,
      slippage: Percentage.createFrom({
        value: DEFAULT_SLIPPAGE_PERCENTAGE,
      }),
    })

    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions: transactions,
      rpcUrl,
      privateKey: signerPrivateKey,
      simulateOnly,
    })
    statuses.forEach((status) => {
      expect(status).toBe('success')
    })

    if (!simulateOnly) {
      const fleetAmountAfter = await sdk.armada.users.getFleetBalance({
        vaultId,
        user,
      })
      const stakedAmountAfter = await sdk.armada.users.getStakedBalance({
        vaultId,
        user,
      })
      console.log(
        'assets after:',
        '\n - wallet',
        fleetAmountAfter.assets.toSolidityValue(),
        '\n - staked',
        stakedAmountAfter.assets.toSolidityValue(),
      )
      console.log(
        'assets difference:',
        '\n - wallet',
        fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).toString(),
        '\n - staked',
        stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
      )
    }
  }
})
