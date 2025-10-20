import { useEffect, useMemo, useRef, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type GlobalRoles } from '@summerfi/sdk-client'

import { getUserData } from '@/helpers/get-user-data'
import { walletRolesToHuman } from '@/helpers/wallet-roles'

export const useWalletRole = ({ institutionName }: { institutionName: string }) => {
  const [connectedRoles, setConnectedRoles] = useState<GlobalRoles[] | null>(null)
  const { isLoadingAccount, userWalletAddress } = useUserWallet()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (isLoadingAccount && userWalletAddress) {
      setConnectedRoles(null)

      return
    }
    if (!userWalletAddress) {
      setConnectedRoles(null)

      return
    }
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    // Create a new controller for this request
    abortControllerRef.current = new AbortController()

    getUserData({
      walletAddress: userWalletAddress,
      institutionName,
      signal: abortControllerRef.current.signal,
    })
      .then((data) => {
        if (data?.walletAddressRoles) {
          setConnectedRoles(data.walletAddressRoles)
        } else {
          // eslint-disable-next-line no-console
          console.log('No role found for wallet address')
          setConnectedRoles(null)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('Error fetching user data', err)
          setConnectedRoles(null)
        }
      })

    // eslint-disable-next-line consistent-return
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [isLoadingAccount, userWalletAddress, institutionName])

  const connectedRolesLabel = useMemo(() => {
    if (isLoadingAccount) {
      return 'Loading...'
    }
    if (!userWalletAddress) {
      return 'No wallet connected'
    }
    if (!connectedRoles || connectedRoles.length === 0) {
      return 'No role'
    }

    return connectedRoles.map(walletRolesToHuman).join(', ')
  }, [connectedRoles, isLoadingAccount, userWalletAddress])

  return {
    connectedRoles,
    connectedRolesLabel,
  }
}
