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
import assert from 'assert'
import { makeSDK } from '@summerfi/sdk-client'
import { createSendTransactionTool, getPublicClientForChain } from '@summerfi/testing-utils'
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts'
import { permit2Address } from '@uniswap/permit2-sdk'
import { encodeFunctionData } from 'viem'

const admiralsQuartersAbi = [
  {
    type: 'function',
    name: 'multicall',
    inputs: [{ name: 'data', type: 'bytes[]', internalType: 'bytes[]' }],
    outputs: [{ name: 'results', type: 'bytes[]', internalType: 'bytes[]' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'enterFleetWithPermit2',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'fleetCommander',
        type: 'address',
      },
      {
        name: 'assets',
        type: 'uint256',
      },
      {
        name: 'referralCode',
        type: 'bytes',
      },
      {
        name: 'permitData',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            type: 'tuple',
            components: [
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
          },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      {
        name: 'signature',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'shares',
        type: 'uint256',
      },
    ],
  },
] as const

jest.setTimeout(300000)

/**
 * @group e2e
 */
describe('Intent swaps: Swap with Deposit', () => {
  const signerPrivateKey = SharedConfig.testUserPrivateKey
  const senderAddressValue = SharedConfig.testUserAddressValue
  const account = privateKeyToAccount(signerPrivateKey)
  const spenderAddressValue = '0x066bA278928cF2f502318C7f689b769F72d67809' // AQ
  const fleetCommanderAddress = FleetAddresses.Base.USDC

  // Configure test scenarios here
  const intentSwapScenarios: {
    chainId: ChainId
    fromSymbol: string
    amountValue: string
    fleetAddressValue: `0x${string}`
    sendOrder: boolean
    cancelOrder: boolean
    limitPrice?: string
    authorizePermit2?: boolean
    revokePermit2?: boolean
  }[] = [
    // eth to erc20
    // {
    //   chainId: ChainIds.Base,
    //   fromSymbol: 'ETH',
    //   amountValue: '0.0005',
    //   fleetAddressValue: FleetAddresses.Base.USDC,
    //   sendOrder: true,
    //   cancelOrder: false,
    //   authorizePermit2: true,
    // },
    // erc20 to erc20
    // {
    //   chainId: ChainIds.Base,
    //   fromSymbol: 'EURC',
    //   amountValue: '1',
    //   fleetAddressValue: FleetAddresses.Base.USDC,
    //   sendOrder: true,
    //   cancelOrder: false,
    //   authorizePermit2: true,
    // },
    // erc20 to eth
    {
      chainId: ChainIds.Base,
      fromSymbol: 'USDC',
      amountValue: '1',
      fleetAddressValue: FleetAddresses.Base.ETH,
      sendOrder: false,
      cancelOrder: false,
      authorizePermit2: true,
    },
  ]

  describe.each(intentSwapScenarios)('with scenario %#', (scenario) => {
    const {
      chainId,
      fromSymbol,
      amountValue,
      fleetAddressValue,
      limitPrice,
      sendOrder,
      cancelOrder,
      authorizePermit2,
      revokePermit2,
    } = scenario

    const publicClient = getPublicClientForChain(chainId, RpcUrls[chainId])

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

      // for ETH, we cannot use ETH directly we need to use WETH
      // there is eth-flow but only smart wallets and no limit orders
      const fromToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: fromSymbol })

      const fromAmount = TokenAmount.createFrom({
        amount: amountValue,
        token: fromToken,
      })
      const toToken = await sdk.armada.users
        .getVaultInfo({
          vaultId: ArmadaVaultId.createFrom({
            chainInfo: getChainInfoByChainId(chainId),
            fleetAddress: Address.createFromEthereum({ value: fleetAddressValue }),
          }),
        })
        .then(async (info) => info.assetToken)

      // get sell order quote
      const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
        sender: senderAddress,
        fromAmount: fromAmount,
        toToken,
        limitPrice,
      })
      console.log('Sell Order Quote:', fromAmount.toString(), '=>', sellQuote.toAmount.toString())

      // check permit2 allowance
      const isPermit2AuthNeeded = await sdk.intentSwaps.isPermit2AuthorizationNeeded({
        ownerAddress: senderAddress,
        tokenAddress: sellQuote.toAmount.token.address,
        amount: sellQuote.toAmount.toSolidityValue(),
        publicClient,
      })
      console.log('Is Permit2 Authorization Needed?', isPermit2AuthNeeded)

      // send permit2 approval first otherwise deposit will fali
      if (isPermit2AuthNeeded && authorizePermit2) {
        const permit2AuthorizationTxInfo = await sdk.intentSwaps.getPermit2AuthorizationTx({
          tokenAddress: sellQuote.toAmount.token.address,
        })
        console.log('Sending Permit2 authorization transaction...')
        const permit2TxStatus = await userSendTxTool(permit2AuthorizationTxInfo)
        assert(permit2TxStatus === 'success', 'Permit2 authorization transaction failed')
      } else if (revokePermit2) {
        const permit2RevokeTxInfo = await sdk.intentSwaps.getPermit2RevokeTx({
          tokenAddress: sellQuote.toAmount.token.address,
        })
        console.log('Sending Permit2 revoke transaction...')
        const revokeTxStatus = await userSendTxTool(permit2RevokeTxInfo)
        assert(revokeTxStatus === 'success', 'Permit2 revoke transaction failed')
      }

      const ownerAddress = senderAddress.toSolidityValue()
      const spenderAddress = spenderAddressValue
      const permitAmount = sellQuote.toAmount.toSolidityValue()
      const permitTokenAddress = sellQuote.toAmount.token.address.toSolidityValue()
      const referralCode = '0x'

      console.log('Permit', { permitAmount, permitTokenAddress })

      const { permitData, signature } = await _createPermit2Data({
        chainId,
        account,
        tokenAddress: permitTokenAddress,
        amount: permitAmount,
        spenderAddress,
      })

      if (sendOrder === false) {
        console.log('Skipping sending order')
        return
      }

      const enterFleetCallData = encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'enterFleetWithPermit2',
        args: [
          ownerAddress,
          fleetCommanderAddress,
          permitAmount,
          referralCode,
          permitData,
          signature,
        ],
      })
      const multicallCallData = encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'multicall',
        args: [[enterFleetCallData]],
      })
      const gasLimit = '2500000'
      const hooks: { target: `0x${string}`; callData: `0x${string}`; gasLimit: string }[] = [
        {
          target: spenderAddressValue,
          callData: multicallCallData,
          gasLimit,
        },
      ]

      console.log(
        'Deposit transactions:',
        hooks.map((tx) => ({
          target: tx.target,
          callData: tx.callData,
          gasLimit: tx.gasLimit,
        })),
      )

      // loop to check allowance, wrap if needed, and finally send order
      let orderId: string | undefined
      do {
        const orderReturn = await sdk.intentSwaps.sendHookOrder({
          chainId,
          account: account,
          sender: senderAddress,
          publicClient: publicClient,
          fromAmount: sellQuote.fromAmount,
          toToken,
          order: sellQuote.order,
          postHooks: hooks,
        })
        orderId = await _handleOrderPrerequisites({
          orderReturn,
          userSendTxTool,
        })
      } while (orderId == null)

      if (cancelOrder == true) {
        // cancel order and exit test if cancelOrder flag is true
        const cancelResult = await sdk.intentSwaps.cancelOrder({
          chainId,
          orderId: orderId,
          account,
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
        // wait exponential retry before checking order status again if order is not yet fulfilled, up to 10 retries
        if (orderInfo === null || orderInfo.order.status !== 'fulfilled') {
          const waitTime = 1000 * Math.pow(retry, 2)
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
      console.log('Order sent:', orderReturn.orderId)
      return orderReturn.orderId
    default:
      throw new Error(`Unknown order status`)
  }
}

async function _createPermit2Data({
  chainId,
  tokenAddress,
  amount,
  spenderAddress,
  account,
}: {
  chainId: ChainId
  tokenAddress: `0x${string}`
  amount: bigint
  spenderAddress: `0x${string}`
  account: PrivateKeyAccount
}) {
  const nonce = BigInt(Date.now()) // unique nonce
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 30) // 30 minutes

  const permitData = {
    permitted: {
      token: tokenAddress,
      amount: amount,
    },
    nonce,
    deadline,
  }

  const domain = {
    name: 'Permit2',
    chainId: chainId,
    verifyingContract: permit2Address(chainId) as `0x${string}`,
  }

  const types = {
    PermitTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    TokenPermissions: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  }

  const signature = await account.signTypedData({
    domain,
    types,
    primaryType: 'PermitTransferFrom',
    message: {
      permitted: {
        token: tokenAddress,
        amount: amount,
      },
      spender: spenderAddress,
      nonce,
      deadline,
    },
  })

  return { permitData, signature }
}
