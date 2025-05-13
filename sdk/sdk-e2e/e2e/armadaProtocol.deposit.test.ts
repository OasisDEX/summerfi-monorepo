/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, userAddress } from './utils/testConfig'
import { waitSeconds } from './utils/wait'
import { DEFAULT_SLIPPAGE_PERCENTAGE, TX_CONFIRMATION_WAIT_TIME } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const chainId = ChainIds.Base
const ethFleet = Address.createFromEthereum({ value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af' })
const usdcFleet = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleet = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE

describe('Armada Protocol Deposit', () => {
  it('should make deposits to fleet', async () => {
    await runTests({
      swapToSymbol: undefined,
      chainId,
      fleetAddress: usdcFleet,
      rpcUrl,
      stake: false,
      amountValue: '1.2',
    })
    // await runTests({
    //   swapToSymbol: undefined,
    //   chainId,
    //   fleetAddress: usdcFleet,
    //   rpcUrl,
    //   amountValue: '0.2',
    // })
  })

  async function runTests({
    swapToSymbol: swapSymbol,
    chainId,
    fleetAddress,
    rpcUrl,
    amountValue,
    stake,
  }: {
    chainId: number
    swapToSymbol: string | undefined
    fleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
    stake?: boolean
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })
    if (!rpcUrl) {
      throw new Error('Missing rpc url')
    }

    const chainInfo = getChainInfoByChainId(chainId)
    const user = User.createFrom({
      wallet: Wallet.createFrom({
        address: userAddress,
      }),
      chainInfo,
    })
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })

    const chain = await sdk.chains.getChain({ chainInfo })
    const vaultInfo = await sdk.armada.users.getVaultInfo({
      vaultId,
    })
    const token = vaultInfo.depositCap.token
    const swapToken = swapSymbol
      ? await chain.tokens.getTokenBySymbol({ symbol: swapSymbol })
      : undefined

    console.log(
      `deposit ${amountValue} USDC to fleet at ${fleetAddress.value} ${stake ? 'with staking' : 'without staking'} ${swapToken ? 'and with swap to ' + swapToken.symbol : ''} `,
    )

    const amount = TokenAmount.createFrom({
      amount: amountValue,
      token: swapToken || token,
    })
    const transactions = await sdk.armada.users.getNewDepositTx({
      vaultId,
      user,
      amount,
      slippage: Percentage.createFrom({
        value: DEFAULT_SLIPPAGE_PERCENTAGE,
      }),
      shouldStake: stake,
    })

    assert(
      vaultInfo.depositCap.isGreaterOrEqualThan(vaultInfo.totalDeposits.add(amount)),
      `Deposit cap is not enough: ${vaultInfo.depositCap.toString()} < ${vaultInfo.totalDeposits
        .add(amount)
        .toString()}`,
    )

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
    const { statuses } = await sendAndLogTransactions({
      chainInfo,
      transactions,
      rpcUrl: rpcUrl,
      privateKey: signerPrivateKey,
    })
    statuses.forEach((status) => {
      expect(status).toBe('success')
    })

    await waitSeconds(TX_CONFIRMATION_WAIT_TIME)

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
})
