'use client'
import { useEffect, useMemo, useState } from 'react'
import { useConnectWallet } from '@web3-onboard/react'

import { networksByHexId } from '@/constants/networks-list'
import { trackAccountChange } from '@/helpers/mixpanel'

export const AccountChangeHandler = () => {
  const [{ wallet }] = useConnectWallet()
  const [savedActiveWallet, setSavedActiveWallet] = useState<string | null>(null)
  const dynamicWalletAddress = useMemo(() => wallet?.accounts[0].address, [wallet?.accounts])

  useEffect(() => {
    const networkData = wallet?.chains[0].id
      ? networksByHexId[wallet.chains[0].id as keyof typeof networksByHexId]
      : false
    const activeWallet = wallet?.accounts[0]
    const walletLabel = wallet?.label

    if (
      networkData &&
      dynamicWalletAddress &&
      activeWallet &&
      walletLabel &&
      savedActiveWallet !== dynamicWalletAddress
    ) {
      setSavedActiveWallet(dynamicWalletAddress)
      trackAccountChange({
        account: dynamicWalletAddress,
        network: networkData.name,
        connectionMethod: 'injected', // no 'network', its just an old OB thing
        walletLabel,
      })
    }
  }, [dynamicWalletAddress, savedActiveWallet, wallet?.accounts, wallet?.chains, wallet?.label])

  return null
}
