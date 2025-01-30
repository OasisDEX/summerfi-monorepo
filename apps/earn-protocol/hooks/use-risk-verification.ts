import { useCallback } from 'react'
import { useLogout } from '@account-kit/react'
import { fetchRisk } from '@summerfi/app-risk'

import { useClientChainId } from './use-client-chain-id'
import { useUserWallet } from './use-user-wallet'

/**
 * Hook to verify wallet risk status.
 * Performs risk assessment check for the connected wallet and handles risky wallet detection.
 * If a wallet is flagged as risky, the user will be logged out and notified.
 *
 * @returns {Object} Object containing the checkRisk function
 * @returns {() => Promise<void>} checkRisk - Async function to perform the risk verification
 */
export const useRiskVerification = () => {
  const { logout } = useLogout()
  const { userWalletAddress } = useUserWallet()
  const { clientChainId } = useClientChainId()

  const checkRisk = useCallback(async () => {
    if (!userWalletAddress || !clientChainId) {
      // eslint-disable-next-line no-console
      console.error('Missing required parameters for risk check')

      return
    }

    try {
      const risk = await fetchRisk({
        chainId: clientChainId,
        walletAddress: userWalletAddress,
        cookiePrefix: 'sumr-claim-token',
        host: '/earn',
      })

      if (risk.isRisky) {
        logout()
        // eslint-disable-next-line no-alert
        alert(
          'Your wallet has been flagged by our automated risk tools, and as such your access to lazy.summer.fi restricted. If you believe this to be incorrect, please reach out to support@summer.fi',
        )
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to perform risk check:', error)
    }
  }, [clientChainId, logout, userWalletAddress])

  return { checkRisk }
}
