import { useSendUserOperation, useSmartAccountClient } from '@alchemy/aa-alchemy/react'
import { type UserOperationOverrides } from '@alchemy/aa-core'
import { Button } from '@summerfi/app-ui'
import { encodeFunctionData } from 'viem'

import { accountType } from '@/providers/AlchemyAccountsProvider/config'

const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'guy', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

// Use maxFeePerGas, maxPriorityFeePerGas, and paymasterAndData override
// to manually set the tx gas fees and the paymasterAndData field
// it's for testnets to make sure tx will go through smoothly
const overrides: UserOperationOverrides = {
  maxFeePerGas: 10000000000n,
  maxPriorityFeePerGas: 10000000000n,
  // paymasterAndData: "0x",
}

export const AccountKitSendUserOperation = () => {
  /**
   * Assumes the app has context of a signer with an authenticated user
   * by using the `AlchemyAccountProvider` from `@alchemy/aa-alchemy/react`.
   */
  const { client } = useSmartAccountClient({
    type: accountType,
  })
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    onSuccess: ({ hash }) => {
      // eslint-disable-next-line no-console
      console.log('hash', hash)
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('txError', error)
    },
  })

  // dummy approve operation to trigger deployment of smart account
  const uoCallData = encodeFunctionData({
    abi,
    functionName: 'approve',
    // dummy address to set approve to
    args: ['0xbfD098bC75b928B56cc4a8E855F6B4EB44b1e483', 0n],
  })

  if (!client) {
    return null
  }

  return (
    <div>
      <Button
        variant="primarySmall"
        onClick={() =>
          sendUserOperation({
            uo: {
              // weth address on sepolia
              target: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
              data: uoCallData,
              value: 0n,
            },
            overrides,
          })
        }
        disabled={isSendingUserOperation}
      >
        {isSendingUserOperation ? 'Sending...' : 'Send UO'}
      </Button>
    </div>
  )
}
