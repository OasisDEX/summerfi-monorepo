export const DCAStrategyManagerAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_accessManager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_ensoRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_harborCommand',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_permit2',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'AmountOverflowsUint160',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotAdmin',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotAuthorizedToBoard',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotCommander',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'CallerIsNotContractSpecificRole',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotCurator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotDecayController',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotFoundation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotGovernor',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotGuardian',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotGuardianOrGovernor',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotKeeper',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotOperator',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotRaft',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotRaftOrCommander',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerIsNotSuperKeeper',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ChainlinkOraclePriceZero',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feed',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'updatedAt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentTime',
        type: 'uint256',
      },
    ],
    name: 'ChainlinkOracleStalePrice',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'CommitmentMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'DirectGrantIsDisabled',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expected',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'received',
        type: 'uint256',
      },
    ],
    name: 'DepositSharesBelowMin',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'DirectRevokeIsDisabled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DuplicateStrategy',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EmptySwapData',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextTriggerAt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimestamp',
        type: 'uint256',
      },
    ],
    name: 'ExecutionWindowNotReached',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expected',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'actual',
        type: 'address',
      },
    ],
    name: 'InAssetVaultMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'InactiveFleetCommander',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'provided',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maximum',
        type: 'uint256',
      },
    ],
    name: 'IntervalTooLong',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'provided',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minimum',
        type: 'uint256',
      },
    ],
    name: 'IntervalTooShort',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'invalidAddress',
        type: 'address',
      },
    ],
    name: 'InvalidAccessManagerAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidFeedAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidHarborCommandAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPermit2Address',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'expected',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'actual',
        type: 'uint256',
      },
    ],
    name: 'InvalidPermit2Amount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expected',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'actual',
        type: 'address',
      },
    ],
    name: 'InvalidPermit2Spender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expected',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'actual',
        type: 'address',
      },
    ],
    name: 'InvalidPermit2Token',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'minPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxPrice',
        type: 'uint256',
      },
    ],
    name: 'InvalidPriceBounds',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidRouterAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'slippageBps',
        type: 'uint256',
      },
    ],
    name: 'InvalidSlippage',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expected',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'actual',
        type: 'address',
      },
    ],
    name: 'OutAssetVaultMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'signed',
        type: 'uint160',
      },
      {
        internalType: 'uint256',
        name: 'required',
        type: 'uint256',
      },
    ],
    name: 'Permit2AllowanceInsufficient',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'required',
        type: 'uint160',
      },
      {
        internalType: 'uint160',
        name: 'actual',
        type: 'uint160',
      },
    ],
    name: 'Permit2AllowanceNotSet',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint48',
        name: 'required',
        type: 'uint48',
      },
      {
        internalType: 'uint48',
        name: 'actual',
        type: 'uint48',
      },
    ],
    name: 'Permit2ExpirationNotSet',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint48',
        name: 'expiration',
        type: 'uint48',
      },
      {
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256',
      },
    ],
    name: 'Permit2ExpirationTooEarly',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'executionPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxPrice',
        type: 'uint256',
      },
    ],
    name: 'PriceAboveCeiling',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'executionPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minPrice',
        type: 'uint256',
      },
    ],
    name: 'PriceBelowFloor',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'SameAsset',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'StrategyNotActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SwapFailed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minOut',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'actualOut',
        type: 'uint256',
      },
    ],
    name: 'SwapOutputBelowMinOut',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'UnauthorizedAccess',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'UnauthorizedOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroDeposit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroExpectedOutShares',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroMaxTrades',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroTradeAmount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tradesExecuted',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'inShares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'outShares',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'inAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'outAssets',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nextTriggerAt',
        type: 'uint256',
      },
    ],
    name: 'ExecutionCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'StrategyCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'reason',
        type: 'bytes32',
      },
    ],
    name: 'StrategyCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'StrategyCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'StrategyEdited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nextTriggerAt',
        type: 'uint256',
      },
    ],
    name: 'StrategyPaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nextTriggerAt',
        type: 'uint256',
      },
    ],
    name: 'StrategyResumed',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ADMIRALS_QUARTERS_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DECAY_CONTROLLER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ENSO_ROUTER',
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
    inputs: [],
    name: 'GOVERNOR_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GUARDIAN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HARBOR_COMMAND',
    outputs: [
      {
        internalType: 'contract IHarborCommand',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PERMIT2',
    outputs: [
      {
        internalType: 'contract IPermit2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SUPER_KEEPER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'commitmentHash',
        type: 'bytes32',
      },
    ],
    name: 'activeCommitments',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'cancelStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'checkUpkeep',
    outputs: [
      {
        internalType: 'bool',
        name: 'upkeepNeeded',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: 'performData',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'createStrategy',
    outputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint160',
                name: 'amount',
                type: 'uint160',
              },
              {
                internalType: 'uint48',
                name: 'expiration',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'nonce',
                type: 'uint48',
              },
            ],
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            name: 'details',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'sigDeadline',
            type: 'uint256',
          },
        ],
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        name: 'permitSingle',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'createStrategyWithPermit2',
    outputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedMinShares',
        type: 'uint256',
      },
    ],
    name: 'depositAndCreate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: 'contract IERC20',
                    name: 'token',
                    type: 'address',
                  },
                  {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                  },
                ],
                internalType: 'struct ISignatureTransfer.TokenPermissions',
                name: 'permitted',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
              },
            ],
            internalType: 'struct ISignatureTransfer.PermitTransferFrom',
            name: 'inAsset',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'inAssetSig',
            type: 'bytes',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'token',
                    type: 'address',
                  },
                  {
                    internalType: 'uint160',
                    name: 'amount',
                    type: 'uint160',
                  },
                  {
                    internalType: 'uint48',
                    name: 'expiration',
                    type: 'uint48',
                  },
                  {
                    internalType: 'uint48',
                    name: 'nonce',
                    type: 'uint48',
                  },
                ],
                internalType: 'struct IAllowanceTransfer.PermitDetails',
                name: 'details',
                type: 'tuple',
              },
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'sigDeadline',
                type: 'uint256',
              },
            ],
            internalType: 'struct IAllowanceTransfer.PermitSingle',
            name: 'shares',
            type: 'tuple',
          },
          {
            internalType: 'bytes',
            name: 'sharesSig',
            type: 'bytes',
          },
        ],
        internalType: 'struct IDCAStrategyManager.Permit2DepositBundle',
        name: 'permits',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'expectedMinShares',
        type: 'uint256',
      },
    ],
    name: 'depositAndCreateWithPermit2',
    outputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'oldConfig',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'newConfig',
        type: 'tuple',
      },
    ],
    name: 'editStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'ensoData',
        type: 'bytes',
      },
    ],
    name: 'executeStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum ContractSpecificRoles',
        name: 'roleName',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'roleTargetContract',
        type: 'address',
      },
    ],
    name: 'generateRole',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasAdmiralsQuartersRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'pauseStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'sourceVault',
            type: 'address',
          },
          {
            internalType: 'contract IFleetCommander',
            name: 'targetVault',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'inAsset',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'outAsset',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'inAssetFeed',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'feed',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'maxStaleness',
                type: 'uint256',
              },
            ],
            internalType: 'struct ChainlinkFeed',
            name: 'outAssetFeed',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'tradeAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'interval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'slippageBps',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxTrades',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyConfig',
        name: 'config',
        type: 'tuple',
      },
    ],
    name: 'resumeStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'strategyCommitments',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'commitmentHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'strategyStates',
    outputs: [
      {
        components: [
          {
            internalType: 'enum IDCAStrategyManager.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint248',
            name: 'tradesExecuted',
            type: 'uint248',
          },
          {
            internalType: 'uint256',
            name: 'nextTriggerAt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastScheduledAt',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDCAStrategyManager.StrategyState',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
