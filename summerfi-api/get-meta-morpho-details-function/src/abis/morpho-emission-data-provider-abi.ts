export const morphoEmissionDataProviderAbi = [
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'rewardToken', type: 'address' },
      { indexed: true, internalType: 'Id', name: 'market', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'address', name: 'urd', type: 'address' },
      {
        components: [
          { internalType: 'uint256', name: 'supplyRewardTokensPerYear', type: 'uint256' },
          { internalType: 'uint256', name: 'borrowRewardTokensPerYear', type: 'uint256' },
          { internalType: 'uint256', name: 'collateralRewardTokensPerYear', type: 'uint256' },
        ],
        indexed: false,
        internalType: 'struct RewardsEmission',
        name: 'rewardsEmission',
        type: 'tuple',
      },
    ],
    name: 'RewardsEmissionSet',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'urd', type: 'address' },
      { internalType: 'address', name: 'rewardToken', type: 'address' },
      { internalType: 'Id', name: 'marketId', type: 'bytes32' },
    ],
    name: 'rewardsEmissions',
    outputs: [
      { internalType: 'uint256', name: 'supplyRewardTokensPerYear', type: 'uint256' },
      { internalType: 'uint256', name: 'borrowRewardTokensPerYear', type: 'uint256' },
      { internalType: 'uint256', name: 'collateralRewardTokensPerYear', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'rewardToken', type: 'address' },
      { internalType: 'address', name: 'urd', type: 'address' },
      { internalType: 'Id', name: 'market', type: 'bytes32' },
      {
        components: [
          { internalType: 'uint256', name: 'supplyRewardTokensPerYear', type: 'uint256' },
          { internalType: 'uint256', name: 'borrowRewardTokensPerYear', type: 'uint256' },
          { internalType: 'uint256', name: 'collateralRewardTokensPerYear', type: 'uint256' },
        ],
        internalType: 'struct RewardsEmission',
        name: 'rewardsEmission',
        type: 'tuple',
      },
    ],
    name: 'setRewardsEmission',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
