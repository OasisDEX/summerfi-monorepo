'use client'
import { useEffect, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'

// this hook doesn't detect chain change when using wallet connect or other EOA not directly injected as window.ethereum
export const useClientChainId = () => {
  const {
    chain: { id },
  } = useChain()
  const user = useUser()

  const [clientChainId, setClientChainId] = useState(id)

  useEffect(() => {
    const getEoaChainId = async () => {
      if (window.ethereum && user?.type === 'eoa') {
        const _eoaChainId = await window.ethereum.request({ method: 'eth_chainId' })

        setClientChainId(Number(_eoaChainId))
      } else {
        setClientChainId(id)
      }
    }

    void getEoaChainId()
  }, [user, id])

  useEffect(() => {
    if (window.ethereum && user?.type === 'eoa') {
      const fn = (chainId: string) => setClientChainId(Number(chainId))

      window.ethereum.on('chainChanged', fn)

      return () => window.ethereum.removeListener('chainChanged', fn)
    } else {
      setClientChainId(id)

      return () => null
    }
  }, [user, id])

  return { clientChainId }
}
