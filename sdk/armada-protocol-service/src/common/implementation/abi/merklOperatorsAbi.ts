export const merklOperatorsAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'operators',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
