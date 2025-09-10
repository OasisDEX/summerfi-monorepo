import { useCallback, useEffect, useState } from 'react'
import { type AlchemySigner } from '@account-kit/core'
import {
  type Address as ViemAddress,
  createWalletClient,
  erc20Abi,
  formatUnits,
  http,
  type PublicClient,
} from 'viem'

interface TokenInfo {
  address: string
  symbol: string
  decimals: number
  balance: string
  balanceFormatted: string
}

/**
 * Custom hook for transferring all ERC20 token balance using viem.
 *
 * This hook fetches balance for a single token address and returns
 * a method that transfers ALL balance to the receiver wallet.
 * Uses Alchemy signer for EOA transactions.
 *
 * @param tokenAddress - ERC20 token contract address
 * @param userWallet - The sender's wallet address
 * @param receiverWallet - The receiver's wallet address
 * @param publicClient - The viem public client for the target network
 * @param signer - The Alchemy signer for signing transactions
 */
export const useTokenTransfer = ({
  tokenAddress,
  receiverWallet,
  userWallet,
  publicClient,
  signer,
}: {
  tokenAddress: string
  receiverWallet: string
  userWallet: string | undefined
  publicClient: PublicClient | undefined
  signer: AlchemySigner | null
}): {
  tokenInfo: TokenInfo | null
  transferAllBalance: () => Promise<string>
  fetchTokenBalance: () => Promise<void>
  isLoadingBalance: boolean
  isTransferring: boolean
  error: string | null
} => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch token balance and info
  const fetchTokenBalance = useCallback(async (): Promise<void> => {
    if (!publicClient || !userWallet || !tokenAddress) {
      return
    }

    setIsLoadingBalance(true)
    setError(null)

    try {
      const [symbol, decimals, balance] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as ViemAddress,
          abi: erc20Abi,
          functionName: 'symbol',
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress as ViemAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        }) as Promise<number>,
        publicClient.readContract({
          address: tokenAddress as ViemAddress,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [userWallet as ViemAddress],
        }) as Promise<bigint>,
      ])

      const balanceFormatted = formatUnits(balance, decimals)

      setTokenInfo({
        address: tokenAddress,
        symbol,
        decimals,
        balance: balance.toString(),
        balanceFormatted,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token balance'

      setError(errorMessage)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [publicClient, userWallet, tokenAddress])

  // Auto-fetch balance when dependencies change
  useEffect(() => {
    fetchTokenBalance()
  }, [fetchTokenBalance])

  /**
   * Transfer ALL token balance to the receiver wallet
   */
  const transferAllBalance = useCallback(async (): Promise<string> => {
    if (!publicClient || !signer) {
      throw new Error('Public client and signer are required')
    }

    if (!receiverWallet) {
      throw new Error('Receiver wallet address is required')
    }

    if (!tokenInfo || tokenInfo.balance === '0') {
      throw new Error('No token balance to transfer')
    }

    setIsTransferring(true)
    setError(null)

    try {
      const account = signer.toViemAccount()

      const walletClient = createWalletClient({
        account,
        chain: publicClient.chain,
        transport: http(),
      })

      const hash = await walletClient.writeContract({
        address: tokenAddress as ViemAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [receiverWallet as ViemAddress, BigInt(tokenInfo.balance)],
        chain: publicClient.chain,
      })

      // Refresh balance after transfer
      await fetchTokenBalance()

      return hash
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed'

      setError(errorMessage)

      throw err
    } finally {
      setIsTransferring(false)
    }
  }, [publicClient, signer, receiverWallet, tokenInfo, tokenAddress, fetchTokenBalance])

  return {
    tokenInfo,
    transferAllBalance,
    fetchTokenBalance,
    isLoadingBalance,
    isTransferring,
    error,
  }
}
