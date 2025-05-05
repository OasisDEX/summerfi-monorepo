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
  type ChainInfo,
  type IArmadaVaultId,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'

import { sendAndLogTransactions } from '@summerfi/testing-utils'
import { signerPrivateKey, SDKApiUrl, userAddress } from './utils/testConfig'
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

describe('Armada Protocol Withdraw', () => {
  const main = async () => {
    const chainInfo = getChainInfoByChainId(chainId)

    await runTests({
      swapToSymbol: undefined,
      chainInfo,
      fleetAddress: usdcFleet,
      rpcUrl,
    })
  }
  main()

  async function runTests({
    swapToSymbol: swapSymbol,
    chainInfo,
    fleetAddress,
    rpcUrl,
  }: {
    chainInfo: ChainInfo
    swapToSymbol: string | undefined
    fleetAddress: Address
    rpcUrl: string | undefined
  }) {
    const sdk: SDKManager = makeSDK({
      apiURL: SDKApiUrl,
    })

    if (!rpcUrl) {
      throw new Error('Missing rpc url')
    }

    let vaultId: IArmadaVaultId
    let token: IToken
    let swapToken: IToken | undefined
    let user: IUser

    beforeEach(async () => {
      console.log(`Preparation for fleet ${fleetAddress} on ${chainInfo.name}`)

      user = User.createFrom({
        wallet: Wallet.createFrom({
          address: userAddress,
        }),
        chainInfo,
      })
      vaultId = ArmadaVaultId.createFrom({
        chainInfo,
        fleetAddress,
      })

      const chain = await sdk.chains.getChain({ chainInfo })
      const vaultInfo = await sdk.armada.users.getVaultInfo({
        vaultId,
      })
      token = vaultInfo.depositCap.token
      swapToken = swapSymbol
        ? await chain.tokens.getTokenBySymbol({ symbol: swapSymbol })
        : undefined
    })

    it(`should withdraw 1 USDC unstaked assets back from fleet at ${fleetAddress.value}`, async () => {
      const amount = TokenAmount.createFrom({
        amount: '1',
        token: swapToken || token,
      })

      const transactions = await sdk.armada.users.getWithdrawTX({
        vaultId: vaultId,
        user,
        amount,
        toToken: swapToken || token,
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
    })
  }
})
