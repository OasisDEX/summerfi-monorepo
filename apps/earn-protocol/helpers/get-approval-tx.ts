import { encodeFunctionData, erc20Abi } from 'viem'

export const getApprovalTx = (address: `0x${string}`, amount: bigint) =>
  encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [address, amount],
  })
