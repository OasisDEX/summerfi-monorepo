import type { ISDKAdminManager, ISDKManager, UnsignedOrder } from '@summerfi/sdk-client'
import { Address, type AddressValue, type ChainId, type ITokenAmount } from '@summerfi/sdk-common'
import { encodeFunctionData, type Account, type PublicClient } from 'viem'

/**
 * @name getIntentSwapsSendDepositOrderHandler
 * @description Approves and sends a CoW swap order with pre/post interaction hooks
 * @param params.fromAmount The token amount to sell
 * @param params.toToken The token to receive
 * @param params.sender The sender's address
 * @param params.chainId The chain ID for the order
 * @param params.order The unsigned order data from a quote
 * @param params.viemAccount The viem account used for signing
 * @param params.publicClient The viem public client for reading chain state
 * @param params.preHooks Optional pre-interaction hooks to execute before the swap
 * @param params.postHooks Optional post-interaction hooks to execute after the swap
 * @param params.apiKey Optional CoW API key
 * @returns The order ID of the submitted order
 */
export const getIntentSwapsSendDepositOrderHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainId,
    fleetAddressValue,
    fromAmount,
    toAmount,
    sender,
    spender,
    order,
    viemAccount: account,
    publicClient,
    referralCode = '0x',
    apiKey,
  }: {
    chainId: ChainId
    fleetAddressValue: AddressValue
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
    sender: AddressValue
    spender: AddressValue
    order: UnsignedOrder
    viemAccount: Account
    publicClient: PublicClient
    referralCode?: `0x${string}`
    apiKey?: string
  }) => {
    const permitAmount = toAmount.toSolidityValue()
    const permitTokenAddress = toAmount.token.address.toSolidityValue()

    const { permitData, signature } = await sdk.intentSwaps.createPermit2Data({
      chainId,
      viemAccount: account,
      tokenAddress: permitTokenAddress,
      amount: permitAmount,
      spenderAddress: spender,
    })
    const enterFleetCallData = encodeFunctionData({
      abi: getAdmiralsQuartersAbi(),
      functionName: 'enterFleetWithPermit2',
      args: [sender, fleetAddressValue, permitAmount, referralCode, permitData, signature],
    })
    const multicallCallData = encodeFunctionData({
      abi: getAdmiralsQuartersAbi(),
      functionName: 'multicall',
      args: [[enterFleetCallData]],
    })
    const gasLimit = '2500000'
    const hooks: { target: `0x${string}`; callData: `0x${string}`; gasLimit: string }[] = [
      {
        target: spender,
        callData: multicallCallData,
        gasLimit,
      },
    ]

    return sdk.intentSwaps.sendHookOrder({
      fromAmount,
      toToken: toAmount.token,
      sender: Address.createFromEthereum({ value: sender }),
      chainId,
      order,
      account,
      publicClient,
      postHooks: hooks,
      apiKey,
    })
  }

function getAdmiralsQuartersAbi() {
  return [
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
}
