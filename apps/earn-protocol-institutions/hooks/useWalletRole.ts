import { useEffect, useMemo, useState } from 'react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { type GeneralRoles } from '@summerfi/sdk-client'

import { getUserData } from '@/helpers/get-user-data'
import { walletRolesToHuman } from '@/helpers/roles-to-human'

export const useWalletRole = ({ institutionName }: { institutionName: string }) => {
  const [connectedRoles, setConnectedRoles] = useState<GeneralRoles[] | null>(null)
  const { isLoadingAccount, userWalletAddress } = useUserWallet()

  useEffect(() => {
    if (isLoadingAccount && userWalletAddress) {
      setConnectedRoles(null)

      return
    }
    if (!userWalletAddress) {
      setConnectedRoles(null)

      return
    }
    // Store the current wallet address in case it changes while the async call is in flight
    const currentWallet = userWalletAddress

    getUserData({
      walletAddress: userWalletAddress,
      institutionName,
    })
      .then((data) => {
        if (userWalletAddress === currentWallet) {
          if (data?.walletAddressRoles) {
            setConnectedRoles(data.walletAddressRoles)
          } else {
            // eslint-disable-next-line no-console
            console.log('No role found for wallet address')
            setConnectedRoles(null)
          }
        }
      })
      .catch((err) => {
        if (userWalletAddress === currentWallet) {
          // eslint-disable-next-line no-console
          console.error('Error fetching user data', err)
          setConnectedRoles(null)
        }
      })
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
