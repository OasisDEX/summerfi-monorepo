import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'
import BigNumber from 'bignumber.js'
import { type Abi } from 'viem'

import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

// Both `tipRate` and `performanceFeeRate` are stored on-chain as uint256 scaled by
// 1e18 (the SDK writes/reads them with `shiftedBy(±18)`), so a raw value of 1e16 == 1.0 == 1%.
const FEE_RATE_DECIMALS = 18

// `tipRate` lives in the checked-in FleetCommander ABI, but `performanceFeeRate` (RWA-only) does
// not, so we read it through a minimal fragment. Non-RWA fleets don't implement it and revert,
// which we treat as "no performance fee".
const performanceFeeRateAbi = [
  {
    type: 'function',
    name: 'performanceFeeRate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'Percentage' }],
    stateMutability: 'view',
  },
] as const satisfies Abi

export type FleetCommanderFees = {
  // annualised management fee (tipRate) as a percentage number (e.g. 1.00 = 1%); null if unreadable
  managementFee: number | null
  // RWA-only performance fee (performanceFeeRate) as a percentage number; null for non-RWA fleets
  performanceFee: number | null
}

const readFeeRate = async (read: () => Promise<bigint | unknown>): Promise<number | null> => {
  try {
    const raw = await read()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (raw === undefined || raw === null) {
      return null
    }

    return new BigNumber(String(raw))
      .shiftedBy(-FEE_RATE_DECIMALS)
      .shiftedBy(
        // the value is in percent, need decimals
        -2,
      )
      .toNumber()
  } catch {
    // A revert (e.g. performanceFeeRate on a non-RWA fleet) or transient RPC error -> treat as absent.
    return null
  }
}

/**
 * Reads the on-chain fee rates for a single fleet (vault) contract.
 *
 * - `managementFee` comes from `tipRate()` and exists on every fleet.
 * - `performanceFee` comes from `performanceFeeRate()` and only exists on RWA fleets; other fleets
 *   revert and yield `null`.
 *
 * Both are returned as decimal fractions ready for `formatDecimalAsPercent`.
 */
export const getFleetCommanderFees = async ({
  fleetAddress,
  chainId,
}: {
  fleetAddress: string
  chainId: number
}): Promise<FleetCommanderFees> => {
  const publicClient = await getSSRPublicClient(chainId)

  if (!publicClient) {
    throw new Error(`No public client available for chainId ${chainId}`)
  }

  const address = fleetAddress as `0x${string}`

  const [managementFee, performanceFee] = await Promise.all([
    readFeeRate(() =>
      publicClient.readContract({
        abi: FleetCommanderAbi,
        address,
        functionName: 'tipRate',
      }),
    ),
    readFeeRate(() =>
      publicClient.readContract({
        abi: performanceFeeRateAbi,
        address,
        functionName: 'performanceFeeRate',
      }),
    ),
  ])

  return { managementFee, performanceFee }
}
