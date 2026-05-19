/**
 * AdmiralsQuarters ("AQ" / DCA Router) ABI.
 *
 * Ported from the hackathon `dca-app/lib/abi.ts`. Wired through
 * `useDCAApproval` once infra publishes the deployed router addresses
 * (see `dca-addresses.ts`). The wizard currently does not call the
 * contract – the approval flow runs in a UI-only simulated mode.
 */
export const dcaRouterAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'contract IERC20', name: 'fromVault', type: 'address' },
          { internalType: 'contract IERC20', name: 'toVault', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minToVaultReceived', type: 'uint256' },
          { internalType: 'bytes32', name: 'allowedVaultsRoot', type: 'bytes32' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
          { internalType: 'bytes32[]', name: 'fromVaultProof', type: 'bytes32[]' },
          { internalType: 'bytes32[]', name: 'toVaultProof', type: 'bytes32[]' },
          { internalType: 'bytes', name: 'swapCalldata', type: 'bytes' },
        ],
        internalType: 'struct AdmiralsQuarters.AutomatedSwapParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'executeAutomatedSwap',
    outputs: [{ internalType: 'uint256', name: 'swappedAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isKeeper',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
