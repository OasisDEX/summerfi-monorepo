'use client'

import { useQuery } from '@tanstack/react-query'
import { type Address } from 'viem'

import { getAllPositions } from '@/lib/positions'
import { getUsdPrices } from '@/lib/prices'

export const usePositions = (address?: Address) => {
  return useQuery({
    queryKey: ['positions', address],
    enabled: Boolean(address),
    staleTime: 30_000,
    queryFn: async () => {
      if (!address) throw new Error('no address')

      const [{ positions, failedChainIds }, prices] = await Promise.all([
        getAllPositions(address),
        getUsdPrices(),
      ])

      return { positions, failedChainIds, prices }
    },
  })
}
