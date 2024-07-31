'use client'
import { useCallback, useEffect, useMemo } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'

interface HomepageHandlerPageProps {
  userAddress: string
}

export const HomepageHandler = ({ userAddress }: HomepageHandlerPageProps) => {
  const [{ wallet }] = useConnectWallet()
  const { push } = useRouter()
  const currentPath = usePathname()

  const dynamicWalletAddress = useMemo(() => wallet?.accounts[0].address, [wallet?.accounts])

  const goToWalletView = useCallback(
    (walletAddress: string) => {
      if (walletAddress) {
        push({
          pathname: currentPath,
          query: { userAddress: walletAddress },
        })
      }
    },
    [currentPath, push],
  )

  useEffect(() => {
    // if user is connected and is visiting a page without wallet
    // address (its or others) in the query, redirect to the view with a wallet address
    if (typeof userAddress === 'undefined' && dynamicWalletAddress) {
      goToWalletView(dynamicWalletAddress)
    }
  }, [dynamicWalletAddress, goToWalletView, userAddress])

  return null
}
