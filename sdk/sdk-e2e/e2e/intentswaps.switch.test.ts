import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  TokenAmount,
  type ChainId,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { FleetAddresses, RpcUrls, SDKApiUrl, SharedConfig } from './utils/testConfig'
import { getCowChainName } from './utils/cow-swap'
import assert from 'assert'
import { makeSDK, type CowHook } from '@summerfi/sdk-client'
import {
  createSendTransactionTool,
  getPublicClientForChain,
  getWalletClientForChain,
} from '@summerfi/testing-utils'
import { encodeFunctionData } from 'viem'
import { AdmiralsQuartersAbi, FleetCommanderAbi } from '@summerfi/armada-protocol-abis'

jest.setTimeout(600000)

/**
 * @group e2e
 */
describe('Intent swaps: Swap with Deposit', () => {
  const signerPrivateKey = SharedConfig.testUserPrivateKey
  const senderAddressValue = SharedConfig.testUserAddressValue
  const aqAddressValue = '0x066bA278928cF2f502318C7f689b769F72d67809' // AQ

  // Configure test scenarios here
  const intentSwapScenarios: {
    chainId: ChainId
    amountValue: string
    fromFleetAddressValue: `0x${string}`
    fleetAddressValue: `0x${string}`
    sendOrder: boolean
    cancelOrder: boolean
    limitPrice?: string
    authorizePermit2?: boolean
    revokePermit2?: boolean
    slippagePercentage: number
  }[] = [
    {
      chainId: ChainIds.Base,
      amountValue: '0.002',
      fromFleetAddressValue: FleetAddresses.Base.ETH,
      fleetAddressValue: FleetAddresses.Base.USDC,
      sendOrder: true,
      cancelOrder: false,
      authorizePermit2: true,
      slippagePercentage: 15,
    },
    // erc20 to erc20
    // {
    //   chainId: ChainIds.Base,
    //   amountValue: '0.5',
    //   fromFleetAddressValue: FleetAddresses.Base.USDC,
    //   fleetAddressValue: FleetAddresses.Base.EURC,
    //   sendOrder: true,
    //   cancelOrder: true,
    //   authorizePermit2: true,
    // },
    // erc20 to eth
    // {
    //   chainId: ChainIds.Base,
    //   fromFleetAddressValue: FleetAddresses.Base.USDC,
    //   amountValue: '1',
    //   fleetAddressValue: FleetAddresses.Base.ETH,
    //   sendOrder: true,
    //   cancelOrder: true,
    //   // authorizePermit2: true,
    // },
  ]

  describe.each(intentSwapScenarios)('with scenario %#', (scenario) => {
    const {
      chainId,
      amountValue,
      fromFleetAddressValue,
      fleetAddressValue,
      limitPrice,
      sendOrder,
      cancelOrder,
      authorizePermit2,
      revokePermit2,
      slippagePercentage,
    } = scenario

    const publicClient = getPublicClientForChain(chainId, RpcUrls[chainId])
    const walletClient = getWalletClientForChain(chainId, RpcUrls[chainId], signerPrivateKey)
    if (walletClient.account == null) {
      throw new Error('Wallet client account is null')
    }

    it('should complete intent swap flow', async () => {
      const sdk = makeSDK({
        apiDomainUrl: SDKApiUrl,
      })
      const userSendTxTool = createSendTransactionTool({
        chainId,
        rpcUrl: RpcUrls[chainId],
        signerPrivateKey,
        senderAddressValue,
        simulateOnly: false,
      })

      const senderAddress = Address.createFromEthereum({ value: senderAddressValue })

      const [fromVaultInfo, toVaultInfo] = await Promise.all([
        sdk.armada.users.getVaultInfo({
          vaultId: ArmadaVaultId.createFrom({
            chainInfo: getChainInfoByChainId(chainId),
            fleetAddress: Address.createFromEthereum({ value: fromFleetAddressValue }),
          }),
        }),
        sdk.armada.users.getVaultInfo({
          vaultId: ArmadaVaultId.createFrom({
            chainInfo: getChainInfoByChainId(chainId),
            fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
          }),
        }),
      ])

      const fromAmount = TokenAmount.createFrom({
        amount: amountValue,
        token: fromVaultInfo.assetToken,
      })

      // get sell order quote
      const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
        sender: senderAddress,
        fromAmount: fromAmount,
        toToken: toVaultInfo.assetToken,
        limitPrice,
        receiver: senderAddress,
        slippagePercentage,
      })
      console.log('Sell Order Quote:', fromAmount.toString(), '=>', sellQuote.toAmount.toString())

      // call previewWithdraw on the fromFleetAddressValue to get the exact amount that will be withdrawn in vault shares
      const vaultSharesToRedeem = await publicClient.readContract({
        address: fromFleetAddressValue,
        abi: FleetCommanderAbi,
        functionName: 'previewWithdraw',
        args: [fromAmount.toSolidityValue()],
      })
      const vaultSharesToken = fromVaultInfo.token
      const isPermit2AuthNeeded = await sdk.intentSwaps.isPermit2AuthorizationNeeded({
        ownerAddress: senderAddress,
        tokenAddress: vaultSharesToken.address,
        amount: vaultSharesToRedeem,
        publicClient,
      })
      console.log('Is Permit2 Authorization Needed?', isPermit2AuthNeeded)

      // send permit2 approval first otherwise deposit will fail
      if (isPermit2AuthNeeded && authorizePermit2) {
        const permit2AuthorizationTxInfo = await sdk.intentSwaps.getPermit2AuthorizationTx({
          tokenAddress: vaultSharesToken.address,
        })
        console.log('Sending Permit2 authorization transaction...')
        const [permit2TxStatus] = await userSendTxTool(permit2AuthorizationTxInfo)
        assert(permit2TxStatus === 'success', 'Permit2 authorization transaction failed')
      } else if (revokePermit2) {
        const permit2RevokeTxInfo = await sdk.intentSwaps.getPermit2RevokeTx({
          tokenAddress: vaultSharesToken.address,
        })
        console.log('Sending Permit2 revoke transaction...')
        const [revokeTxStatus] = await userSendTxTool(permit2RevokeTxInfo)
        assert(revokeTxStatus === 'success', 'Permit2 revoke transaction failed')
      }

      const gasLimit = '1500000'
      const referralCode = '0x'

      const withdrawPermitAmount = vaultSharesToRedeem
      const withdrawPermitTokenAddress = vaultSharesToken.address.toSolidityValue()
      const depositPermitAmount = sellQuote.toAmount.toSolidityValue()
      const depositPermitTokenAddress = sellQuote.toAmount.token.address.toSolidityValue()

      console.log('Permit', {
        withdrawPermitAmount: withdrawPermitAmount,
        withdrawPermitTokenAddress: withdrawPermitTokenAddress,
        depositPermitAmount: depositPermitAmount,
        depositPermitTokenAddress: depositPermitTokenAddress,
      })

      const { permitData: withdrawPermitData, signature: withdrawSignature } =
        await sdk.intentSwaps.createPermit2Data({
          chainId,
          signTypedData: walletClient.signTypedData,
          viemAccount: walletClient.account,
          tokenAddress: withdrawPermitTokenAddress,
          amount: withdrawPermitAmount,
          spenderAddress: aqAddressValue,
        })
      const withdrawCallData = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'exitFleetWithPermit2',
        args: [senderAddressValue, fromFleetAddressValue, withdrawPermitData, withdrawSignature],
      })
      const withdrawMultiCallData = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [[withdrawCallData]],
      })
      const preHooks: CowHook[] = [
        {
          target: aqAddressValue,
          callData: withdrawMultiCallData,
          gasLimit,
        },
      ]

      const { permitData: depositPermitData, signature: depositSignature } =
        await sdk.intentSwaps.createPermit2Data({
          chainId,
          signTypedData: walletClient.signTypedData,
          viemAccount: walletClient.account,
          tokenAddress: depositPermitTokenAddress,
          amount: depositPermitAmount,
          spenderAddress: aqAddressValue,
        })

      const enterFleetCallData = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'enterFleetWithPermit2',
        args: [
          senderAddressValue,
          fleetAddressValue,
          depositPermitAmount,
          referralCode,
          depositPermitData,
          depositSignature,
        ],
      })
      const depositMultiCallData = encodeFunctionData({
        abi: AdmiralsQuartersAbi,
        functionName: 'multicall',
        args: [[enterFleetCallData]],
      })
      const postHooks: CowHook[] = [
        {
          target: aqAddressValue,
          callData: depositMultiCallData,
          gasLimit,
        },
      ]

      if (sendOrder === false) {
        console.log('Skipping sending order')
        return
      }
      // loop to check allowance, wrap if needed, and finally send order
      let orderId: string | undefined
      do {
        const orderReturn = await sdk.intentSwaps.sendHookOrder({
          chainId,
          walletClient,
          sender: senderAddress,
          publicClient: publicClient,
          fromAmount: sellQuote.fromAmount,
          limitPrice: sellQuote.limitPrice,
          toToken: sellQuote.toAmount.token,
          order: sellQuote.order,
          preHooks,
          postHooks,
          slippagePercentage,
        })
        orderId = await _handleOrderPrerequisites({
          orderReturn,
          userSendTxTool,
          chainId,
        })
      } while (orderId == null)

      if (cancelOrder == true) {
        // cancel order and exit test if cancelOrder flag is true
        const cancelResult = await sdk.intentSwaps.cancelOrder({
          chainId,
          orderId: orderId,
          walletClient,
          publicClient,
        })

        console.log('Cancel Order:', cancelResult)
        return
      }

      // check order status
      let retry = 0
      let orderInfo: Awaited<ReturnType<typeof sdk.intentSwaps.checkOrder>> | null = null
      do {
        orderInfo = await sdk.intentSwaps.checkOrder({
          chainId,
          orderId: orderId,
        })
        retry++
        // wait with exponential backoff before checking order status again if order is not yet fulfilled
        if (orderInfo === null || orderInfo.order.status !== 'fulfilled') {
          if (orderInfo?.order.status === 'expired') {
            throw new Error(`Order ${orderId} has expired`)
          }
          const waitTime = 1000 * Math.pow(2, retry - 1) // exponential backoff
          console.log(
            `Order not fulfilled yet (status: ${orderInfo?.order.status ?? 'null'}), retrying in ${waitTime} ms... (${retry}/10)`,
          )
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      } while (retry <= 10 && (orderInfo === null || orderInfo.order.status !== 'fulfilled'))

      assert(orderInfo, 'Order info should not be null')
      assert(
        orderInfo.order.status === 'fulfilled',
        `Order was not fulfilled, status: ${orderInfo.order.status}`,
      )
      console.log('Check Order:', orderInfo)
    })
  })
})

async function _handleOrderPrerequisites({
  orderReturn,
  userSendTxTool,
  chainId,
}: {
  orderReturn:
    | {
        status: 'wrap_to_native'
        transactionInfo: TransactionInfo
      }
    | {
        status: 'allowance_needed'
        transactionInfo: TransactionInfo
      }
    | {
        status: 'order_sent'
        orderId: string
      }
  userSendTxTool: ReturnType<typeof createSendTransactionTool>
  chainId: ChainId
}): Promise<string | undefined> {
  switch (orderReturn.status) {
    case 'wrap_to_native':
    case 'allowance_needed': {
      console.log(`Handling ${orderReturn.status} tx...`)
      // send tx
      const status = await userSendTxTool(orderReturn.transactionInfo)
      // Verify transaction success
      expect(status).toBe('success')
      return undefined
    }
    case 'order_sent':
      console.log(
        'Order sent:',
        `https://explorer.cow.fi/${getCowChainName(chainId)}/orders/${orderReturn.orderId}`,
      )
      return orderReturn.orderId
    default:
      throw new Error(`Unknown order status`)
  }
}
