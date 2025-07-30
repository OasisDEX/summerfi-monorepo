'use client'
import { useEffect, useState } from 'react'
import { useChain, useUser } from '@account-kit/react'
import { AccountKitAccountType, useIsIframe } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { supportedSDKNetworkId } from '@summerfi/app-utils'

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
  const isIframe = useIsIframe()

  const [clientChainId, setClientChainId] = useState<SupportedNetworkIds>(supportedSDKNetworkId(id))

  useEffect(() => {
    const getEoaChainId = async () => {
      if (window.ethereum && user?.type === AccountKitAccountType.EOA && !isIframe) {
        const _eoaChainId = await window.ethereum.request({ method: 'eth_chainId' })
        const accounts: string[] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })

        // Additonal check to ensure that the injected ethereum account is the same as user address
        // It's crucial for safe where window.ethereum returns signer account instead of connected account
        if (accounts.map((a) => a.toLowerCase()).includes(user.address.toLowerCase())) {
          // eslint-disable-next-line no-console
          console.log('Updated EOA client chain id to:', _eoaChainId)
          setClientChainId(Number(_eoaChainId))
        } else {
          setClientChainId(id)
        }
      } else {
        setClientChainId(id)
      }
    }

    void getEoaChainId()
  }, [user, id, isIframe])

  useEffect(() => {
    if (window.ethereum && user?.type === AccountKitAccountType.EOA) {
      const fn = (chainId: string) => {
        // eslint-disable-next-line no-console
        console.log('EOA client chain id changed to:', chainId)

        setClientChainId(Number(chainId))
      }

      window.ethereum.on('chainChanged', fn)

      return () => window.ethereum.removeListener('chainChanged', fn)
    } else {
      setClientChainId(id)

      return () => null
    }
  }, [user, id])

  return { clientChainId }
}
