import { useEffect, useState } from 'react'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId } from '@summerfi/sdk-common'

type UseIsWhitelistedProps = {
  isRwaVault: boolean
  sdk: SdkClient
  walletAddress?: string
  fleetAddress: string
  chainId: number
}

export const useIsWhitelisted = ({
  isRwaVault,
  sdk,
  walletAddress,
  fleetAddress,
  chainId,
}: UseIsWhitelistedProps) => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Nothing to check for non-RWA vaults or disconnected wallets.
    if (!isRwaVault || !walletAddress) {
      setIsWhitelisted(undefined)
      setIsLoading(false)

      return () => {
        cancelled = true
      }
    }

    const fetchIsWhitelisted = async () => {
      setIsLoading(true)

      try {
        const result = await sdk.getRwaIsWhitelisted({
          accountAddress: walletAddress as `0x${string}`,
          chainId: chainId as ChainId,
          fleetAddress: fleetAddress as `0x${string}`,
        })

        if (!cancelled) {
          setIsWhitelisted(result)
        }
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Failed to check RWA whitelist status', error)
          setIsWhitelisted(undefined)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchIsWhitelisted()

    return () => {
      cancelled = true
    }
  }, [isRwaVault, sdk, walletAddress, fleetAddress, chainId])

  return {
    isWhitelisted: !!isWhitelisted,
    isLoading,
  }
}
