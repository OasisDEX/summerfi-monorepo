export const SummerVestingWalletFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'VestingWalletAlreadyExists',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'vestingWallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timeBasedAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'goalAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'enum ISummerVestingWallet.VestingType',
        name: 'vestingType',
        type: 'uint8',
      },
    ],
    name: 'VestingWalletCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'timeBasedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'goalAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'enum ISummerVestingWallet.VestingType',
        name: 'vestingType',
        type: 'uint8',
      },
    ],
    name: 'createVestingWallet',
    outputs: [
      {
        internalType: 'address',
        name: 'newVestingWallet',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'vestingWalletOwners',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'vestingWallets',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const