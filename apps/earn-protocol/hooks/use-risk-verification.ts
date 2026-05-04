import { useCallback } from 'react'
import {
  useEarnProtocolChain,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { fetchRisk } from '@summerfi/app-risk'

import { type TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'

/**
 * Hook to verify wallet risk status.
 * Performs risk assessment check for the connected wallet and handles risky wallet detection.
 * If a wallet is flagged as risky, the user will be logged out and notified.
 * @param {TermsOfServiceCookiePrefix} cookiePrefix - The cookie prefix to use for the risk check
 * @returns {Object} Object containing the checkRisk function
 * @returns {() => Promise<RiskDataResponse>} checkRisk - Async function to perform the risk verification
 */
export const useRiskVerification = ({
  cookiePrefix,
}: {
  cookiePrefix: TermsOfServiceCookiePrefix
}) => {
  const { logout } = useEarnProtocolLogin()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { chain } = useEarnProtocolChain()

  const checkRisk = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!userWalletAddress || !chain.id) {
      // eslint-disable-next-line no-console
      console.error('Missing required parameters for risk check')

      return { isRisky: false }
    }

    try {
      const risk = await fetchRisk({
        chainId: chain.id,
        walletAddress: userWalletAddress,
        cookiePrefix,
        host: '/earn',
      })

      if (risk.isRisky) {
        logout()
        // eslint-disable-next-line no-alert
        alert(
          'Your wallet has been flagged by our automated risk tools, and as such your access to summer.fi restricted. If you believe this to be incorrect, please reach out to support@summer.fi',
        )
      }

      return risk
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to perform risk check:', error)

      return { isRisky: false }
    }
  }, [chain.id, cookiePrefix, logout, userWalletAddress])

  return { checkRisk }
}
