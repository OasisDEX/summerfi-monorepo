export const merklToggleAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'toggleOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
