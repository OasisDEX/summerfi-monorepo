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
  type ChainId,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, testWalletAddress } from './utils/testConfig'
import { DEFAULT_SLIPPAGE_PERCENTAGE, TX_CONFIRMATION_WAIT_TIME } from './utils/constants'
import assert from 'assert'

jest.setTimeout(300000)
const simulateOnly = false

const ethFleetBase = Address.createFromEthereum({
  value: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
})
const usdcFleetBase = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const eurcFleetBase = Address.createFromEthereum({
  value: '0x64db8f51f1bf7064bb5a361a7265f602d348e0f0',
})
const selfManagedFleetBase = Address.createFromEthereum({
  value: '0x29f13a877F3d1A14AC0B15B07536D4423b35E198',
})
const usdtFleetArb = Address.createFromEthereum({
  value: '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
})
const usdcFleetSonic = Address.createFromEthereum({
  value: '0x507a2d9e87dbd3076e65992049c41270b47964f8',
})

describe('Armada Protocol Deposit', () => {
  it('should make deposits to fleet', async () => {
    const rpcUrl = process.env.E2E_SDK_FORK_URL_BASE
    const chainId = ChainIds.Base
    const fleetAddress = ethFleetBase
    const userAddress = testWalletAddress
    const swapToSymbol = undefined

    // await runTests({
    //   rpcUrl,
    //   chainId,
    //   fleetAddress,
    //   userAddress,
    //   amountValue: '0.5',
    //   swapToSymbol,
    //   stake: true,
    // })
    await runTests({
      rpcUrl,
      chainId,
      fleetAddress,
      userAddress,
      amountValue: '0.003',
      swapToSymbol,
    })
  })
})

async function runTests({
  chainId,
  swapToSymbol: swapSymbol,
  fleetAddress,
  rpcUrl,
  amountValue,
  userAddress,
  stake,
  referralCode,
}: {
  chainId: ChainId
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

  const vaultInfo = await sdk.armada.users.getVaultInfo({
    vaultId,
  })
  const token = vaultInfo.depositCap.token
  const swapToken = swapSymbol
    ? await sdk.tokens.getTokenBySymbol({ chainId, symbol: swapSymbol })
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

  console.log(
    `deposit ${amountValue} USDC to fleet at ${fleetAddress.value} ${stake ? 'with staking' : 'without staking'} ${swapToken ? ', swapping to ' + swapToken.symbol : ''} ${referralCode ? 'with referral code ' + referralCode : ''}`,
  )

  const amount = TokenAmount.createFrom({
    amount: amountValue,
    token: swapToken || token,
  })

  assert(
    vaultInfo.depositCap.isGreaterOrEqualThan(vaultInfo.totalDeposits.add(amount)),
    `Deposit cap is not enough: ${vaultInfo.depositCap.toString()} < ${vaultInfo.totalDeposits
      .add(amount)
      .toString()}`,
  )

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

  const { statuses } = await sendAndLogTransactions({
    chainInfo,
    transactions,
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
