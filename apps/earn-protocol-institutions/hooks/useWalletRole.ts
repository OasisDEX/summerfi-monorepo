import { useEffect, useMemo, useRef, useState } from 'react'
import { useEarnProtocolWallet } from '@summerfi/app-earn-ui'
import { type GlobalRoles } from '@summerfi/sdk-client'

import { getUserData } from '@/helpers/get-user-data'
import { globalRoleToHuman } from '@/helpers/wallet-roles'

export const useWalletGlobalRole = ({ institutionName }: { institutionName: string }) => {
  const [connectedRoles, setConnectedRoles] = useState<GlobalRoles[] | null>(null)
  // RWA (institutions-v2) role labels, already human-readable (e.g. "Curator", "Keeper"). Kept
  // separate from the global `GlobalRoles[]` since RWA roles include contract-specific roles that
  // aren't part of that enum.
  const [connectedRwaRoleLabels, setConnectedRwaRoleLabels] = useState<string[] | null>(null)
  const [isLoadingConnectedRoles, setIsLoadingConnectedRoles] = useState<boolean>(true)
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setIsLoadingConnectedRoles(false)
    if (isLoadingAccount && userWalletAddress) {
      setConnectedRoles(null)
      setConnectedRwaRoleLabels(null)

      return
    }
    if (!userWalletAddress) {
      setConnectedRoles(null)
      setConnectedRwaRoleLabels(null)

      return
    }
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    // Create a new controller for this request
    abortControllerRef.current = new AbortController()

    setIsLoadingConnectedRoles(true)

    getUserData({
      walletAddress: userWalletAddress,
      institutionName,
      signal: abortControllerRef.current.signal,
    })
      .then((data) => {
        if (data?.walletAddressRoles) {
          setConnectedRoles(data.walletAddressRoles)
        } else {
          setConnectedRoles(null)
        }
        setConnectedRwaRoleLabels(data?.rwaRoleLabels ?? null)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('Error fetching user data', err)
          setConnectedRoles(null)
          setConnectedRwaRoleLabels(null)
        }
      })
      .finally(() => {
        setIsLoadingConnectedRoles(false)
      })

    // eslint-disable-next-line consistent-return
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [isLoadingAccount, userWalletAddress, institutionName])

  const connectedRolesLabel = useMemo(() => {
    if (!userWalletAddress) {
      return 'No wallet connected'
    }
    if (isLoadingAccount || isLoadingConnectedRoles) {
      return 'Loading...'
    }

    // Union of global roles (standard institutions) and RWA role labels (institutions-v2). Deduped
    // because RWA `getAllRoles` also surfaces global roles, so a mixed institution could list a role
    // from both sources.
    const labels = Array.from(
      new Set([
        ...(connectedRoles ?? []).map(globalRoleToHuman),
        ...(connectedRwaRoleLabels ?? []),
      ]),
    )

    if (labels.length === 0) {
      return 'No role'
    }

    return labels.join(', ')
  }, [
    connectedRoles,
    connectedRwaRoleLabels,
    isLoadingAccount,
    userWalletAddress,
    isLoadingConnectedRoles,
  ])

  return {
    connectedRoles,
    connectedRwaRoleLabels,
    connectedRolesLabel,
  }
}
