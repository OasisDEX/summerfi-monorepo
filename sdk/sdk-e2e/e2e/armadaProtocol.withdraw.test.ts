import { makeSDK, type SDKManager } from '@summerfi/sdk-client'
import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  Wallet,
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = false

const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const selfManagedFleet = Address.createFromEthereum({
  value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
})

describe('Armada Protocol Withdraw', () => {
  it('should withdraw from fleet', async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const chainId = ChainIds.Base
    const fleetAddress = usdcFleet
    const userAddress = testWalletAddress
    const amountValue = '1.9999'
    const swapToSymbol = undefined

    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      amountValue,
      swapToSymbol,
    })
  })

  async function runTests({
    chainId,
    swapToSymbol: swapSymbol,
    fleetAddress,
    rpcUrl,
    amountValue,
    userAddress,
  }: {
    chainId: ChainId
    swapToSymbol: string | undefined
    fleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
    userAddress: Address
  }) {
    const sdk: SDKManager = makeSDK({
      apiDomainUrl: SDKApiUrl,
    })
    if (!rpcUrl) {
      throw new Error('Missing rpc url')
    }

    const chainInfo = getChainInfoByChainId(chainId)

    const user = User.createFrom({
      chainInfo,
      wallet: Wallet.createFrom({
        address: userAddress,
      }),
    })
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    const token = vaultInfo.depositCap.token
    const swapToken = swapSymbol
      ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: swapSymbol })
      : undefined

    console.log(
      `withdraw ${amountValue} USDC unstaked assets back from fleet at ${fleetAddress.value}`,
    )

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: swapToken || token,
    })

    const transactions = await sdk.armada.users.getWithdrawTx({
      vaultId: vaultId,
      user,
      amount,
      toToken: swapToken || token,
      slippage: Percentage.createFrom({
        value: DEFAULT_SLIPPAGE_PERCENTAGE,
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
      fleetAmountBefore.assets.toSolidityValue(),
      '/',
      stakedAmountBefore.assets.toSolidityValue(),
    )

    const totalAssetsBefore = fleetAmountBefore.assets.add(stakedAmountBefore.assets)
    assert(
      totalAssetsBefore.isGreaterOrEqualThan(amount),
      `Fleet balance is not enough: ${totalAssetsBefore.toString()} < ${amount.toString()}`,
    )

    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions: transactions,
      rpcUrl: rpcUrl,
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
        'after',
        fleetAmountAfter.assets.toSolidityValue(),
        '/',
        stakedAmountAfter.assets.toSolidityValue(),
      )
      console.log(
        'difference',
        fleetAmountAfter.assets.subtract(fleetAmountBefore.assets).toString(),
        '/',
        stakedAmountAfter.assets.subtract(stakedAmountBefore.assets).toString(),
      )
    }
  }
})
