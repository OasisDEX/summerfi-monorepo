'use client'
import { useEffect, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'

import { AccountKitAccountType } from '@/account-kit/types'

/**
 * Hook to get the current blockchain network chain ID, with special handling for EOA accounts.
 * For EOA accounts using window.ethereum (like MetaMask), it listens to chain changes directly.
 * For other account types, it uses the chain ID from AccountKit.
 *
 * CAUTION: this hook doesn't detect chain change when using wallet connect or other EOA not directly injected as window.ethereum
 *
 * @returns {Object} An object containing the current chain ID
 * @returns {number} returns.clientChainId - The current blockchain network chain ID
 */
export const useClientChainId = () => {
  const {
    chain: { id },
  } = useChain()
  const user = useUser()

  const [clientChainId, setClientChainId] = useState(id)

  useEffect(() => {
    const getEoaChainId = async () => {
      if (window.ethereum && user?.type === AccountKitAccountType.EOA) {
        const _eoaChainId = await window.ethereum.request({ method: 'eth_chainId' })

        // eslint-disable-next-line no-console
        console.log('Eoa chain id', _eoaChainId)

        setClientChainId(Number(_eoaChainId))
      } else {
        setClientChainId(id)
      }
    }

    void getEoaChainId()
  }, [user, id])

  useEffect(() => {
    if (window.ethereum && user?.type === AccountKitAccountType.EOA) {
      const fn = (chainId: string) => {
        // eslint-disable-next-line no-console
        console.log('Updating EOA client chain id', chainId)

        setClientChainId(Number(chainId))
      }

      window.ethereum.on('chainChanged', fn)

      return () => window.ethereum.removeListener('chainChanged', fn)
    } else {
      setClientChainId(id)

      return () => null
    }
  }, [user, id])

  // eslint-disable-next-line no-console
  console.log('Client chain id info', {
    user,
    clientChainId,
  })

  return { clientChainId }
}
