'use client'

import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

import { getStakedSumr } from '@/lib/staking'

/** Base-only SUMR staking position for the given wallet (null when nothing is staked/claimable). */
export const useStakedSumr = (address?: Address) => {
  return useQuery({
    queryKey: ['staked-sumr', address],
    enabled: Boolean(address),
    staleTime: 30_000,
    queryFn: () => {
      if (!address) throw new Error('no address')

      return getStakedSumr(address)
    },
  })
}
