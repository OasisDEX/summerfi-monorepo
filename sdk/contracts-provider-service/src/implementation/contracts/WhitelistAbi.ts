/**
 * @name AdmiralsQuartersWhitelistAbi
 * @description Minimal ABI for whitelist functions in AdmiralsQuarters contract
 */
export const WhitelistAbi = [
  {
    type: 'function',
    name: 'isWhitelisted',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setWhitelisted',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'allowed', type: 'bool', internalType: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setWhitelistedBatch',
    inputs: [
      { name: 'accounts', type: 'address[]', internalType: 'address[]' },
      { name: 'allowed', type: 'bool[]', internalType: 'bool[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
