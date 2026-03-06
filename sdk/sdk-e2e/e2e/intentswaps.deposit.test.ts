import {
  Address,
  ArmadaVaultId,
  ChainIds,
  getChainInfoByChainId,
  Percentage,
  TokenAmount,
  User,
  type ChainId,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { FleetAddresses, RpcUrls, SDKApiUrl, SharedConfig } from './utils/testConfig'
import assert from 'assert'
import { makeSDKWithSigner } from '@summerfi/sdk-client'
import { Wallet } from 'ethers'
import { createSendTransactionTool, getPublicClientForChain } from '@summerfi/testing-utils'
import { privateKeyToAccount } from 'viem/accounts'
import { permit2Address } from '@uniswap/permit2-sdk'
import { createWalletClient, encodeFunctionData } from 'viem'

const admiralsQuartersAbi = [
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

  // Configure test scenarios here
  const intentSwapScenarios: {
    chainId: ChainId
    fromSymbol: string
    amountValue: string
    toSymbol: string
    sendOrder: boolean
    cancelOrder: boolean
    limitPrice?: string
  }[] = [
    {
      chainId: ChainIds.Base,
      fromSymbol: 'ETH',
      amountValue: '0.0005',
      toSymbol: 'USDC',
      sendOrder: true,
      cancelOrder: false,
    },
    // {
    //   chainId: ChainIds.Base,
    //   fromSymbol: 'USDC',
    //   amountValue: '5',
    //   toSymbol: 'ETH',
    //   sendOrder: true,
    //   cancelOrder: false,
    // },
  ]

  describe.each(intentSwapScenarios)('with scenario %#', (scenario) => {
    const { chainId, fromSymbol, amountValue, toSymbol, limitPrice, sendOrder, cancelOrder } =
      scenario

    const publicClient = getPublicClientForChain(chainId, RpcUrls[chainId])

    it('should complete intent swap flow', async () => {
      const sdk = makeSDKWithSigner({
        apiDomainUrl: SDKApiUrl,
        signer: new Wallet(signerPrivateKey),
      })
      const userSendTxTool = createSendTransactionTool({
        chainId,
        rpcUrl: RpcUrls[chainId],
        signerPrivateKey,
        senderAddressValue,
      })

      const senderAddress = Address.createFromEthereum({ value: senderAddressValue })

      // for ETH, we cannot use ETH directly we need to use WETH
      // there is eth-flow but only smart wallets and no limit orders
      const fromToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: fromSymbol })

      const fromAmount = TokenAmount.createFrom({
        amount: amountValue,
        token: fromToken,
      })
      const toToken = await sdk.tokens.getTokenBySymbol({ chainId, symbol: toSymbol })

      // get sell order quote
      const sellQuote = await sdk.intentSwaps.getSellOrderQuote({
        sender: senderAddress,
        fromAmount: fromAmount,
        toToken,
        limitPrice,
      })
      console.log('Sell Order Quote:', fromAmount.toString(), '=>', sellQuote.toAmount.toString())

      if (sendOrder === false) {
        console.log('Skipping sending order')
        return
      }

      // loop to check allowance, wrap if needed, and finally send order
      let orderId: string | undefined
      const aqAddress = '0x066bA278928cF2f502318C7f689b769F72d67809'
      const fleetCommanderAddress = FleetAddresses.Base.USDC
      const ownerAddress = senderAddress.toSolidityValue()
      const amount = fromAmount.toSolidityValue()
      const referralCode = '0x'

      const { permitData, signature } = await _createPermit2Data({
        chainId,
        tokenAddress: fromAmount.token.address.toSolidityValue(),
        amount,
        ownerAddress,
        spenderAddress: aqAddress,
        walletClient: createWalletClient({
          account,
          chain: publicClient.chain,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transport: publicClient.transport as any,
        }),
      })

      const callData = encodeFunctionData({
        abi: admiralsQuartersAbi,
        functionName: 'enterFleetWithPermit2',
        args: [ownerAddress, fleetCommanderAddress, amount, referralCode, permitData, signature],
      })
      const gasLimit = '1500000'
      const hooks: { target: `0x${string}`; callData: `0x${string}`; gasLimit: string }[] = [
        {
          target: aqAddress,
          callData,
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

      // check order status
      const orderInfo = await sdk.intentSwaps.checkOrder({
        chainId,
        orderId: orderId,
      })
      assert(orderInfo, 'Order info should not be null')
      console.log('Check Order:', orderInfo)

      if (cancelOrder === false) {
        console.log('Skipping cancelling order')
        return
      }

      // cancel order
      const cancelResult = await sdk.intentSwaps.cancelOrder({
        chainId,
        orderId: orderId,
        account,
        publicClient,
      })
      console.log('Cancel Order:', cancelResult)
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
  ownerAddress,
  spenderAddress,
  walletClient,
}: {
  chainId: ChainId
  tokenAddress: `0x${string}`
  amount: bigint
  ownerAddress: `0x${string}`
  spenderAddress: `0x${string}`
  walletClient: ReturnType<typeof createWalletClient>
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

  const signature = await walletClient.signTypedData({
    account: ownerAddress,
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
