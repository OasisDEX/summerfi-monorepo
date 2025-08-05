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
import { signerPrivateKey, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE, TX_CONFIRMATION_WAIT_TIME } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)

const ethFleetBase = Address.createFromEthereum({
  value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
})
const usdcFleetBase = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleetBase = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const usdtFleetArb = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const usdcFleetSonic = Address.createFromEthereum({
  value: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
})
const permissionedFleetAddressUsdc = Address.createFromEthereum({
  value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
})

describe('Armada Protocol Deposit', () => {
  it('should make deposits to fleet', async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const chainId = ChainIds.Base
    const fleetAddress = permissionedFleetAddressUsdc
    const swapToSymbol = undefined
    const amountValue = '1'
    const userAddress = testWalletAddress

    await runTests({
      swapToSymbol,
      chainId,
      fleetAddress,
      rpcUrl,
      amountValue,
      userAddress,
      stake: false,
    })
    // await runTests({
    //   swapToSymbol,
    //   chainId,
    //   fleetAddress,
    //   rpcUrl,
    //   amountValue,
    // })
  })

  async function runTests({
    swapToSymbol: swapSymbol,
    chainId,
    fleetAddress,
    rpcUrl,
    amountValue,
    userAddress,
    stake,
    referralCode,
  }: {
    chainId: number
    swapToSymbol: string | undefined
    fleetAddress: Address
    rpcUrl: string | undefined
    amountValue: string
    userAddress: Address
    stake?: boolean
    referralCode?: string
  }) {
    const sdk: SDKManager = makeSDK({
      apiDomainUrl: SDKApiUrl,
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
      `deposit ${amountValue} USDC to fleet at ${fleetAddress.value} ${stake ? 'with staking' : 'without staking'} ${swapToken ? ', swapping to ' + swapToken.symbol : ''} ${referralCode ? 'with referral code ' + referralCode : ''}`,
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
      referralCode,
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
