'use client'
import { useCallback, useEffect, useState } from 'react'
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities'
import {
  type Address,
  formatEther,
  formatGwei,
  parseEther,
  type PublicClient,
  type WalletClient,
} from 'viem'

import { OFT_ABI } from '@/features/bridge/constants/abi'
import { type Fee, type SendParam, type SimulatedTransactionDetails } from '@/features/bridge/types'

// Helper functions
function handleSimulationError(error: any) {
  let errorMessage = 'Unknown error occurred'

  if (error.message.includes('InsufficientBalance')) {
    errorMessage = 'Insufficient balance for the transfer'
  } else if (error.message.includes('InvalidAmount')) {
    errorMessage = 'Invalid amount specified for transfer'
  } else if (error.message.includes('NoPeer')) {
    errorMessage = 'No peer found for the destination chain'
  } else if (error.cause) {
    errorMessage = `${error.message}\nCause: ${error.cause.message}`
  } else {
    errorMessage = error.message
  }

  // setSimulationError(errorMessage)
  // setDetails((prev) => ({ ...prev, isReady: false }))
}

async function switchNetworkIfNeeded(wallet: WalletClient) {
  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })

  if (parseInt(currentChainId, 16) !== wallet.chain.id) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${wallet.chain.id.toString(16)}` }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${wallet.chain.id.toString(16)}`,
              chainName: wallet.chain.name,
              nativeCurrency: wallet.chain.nativeCurrency,
              rpcUrls: wallet.chain.rpcUrls.default.http,
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }
}

interface BridgeTransactionReturn {
  gasOnDestination: string
  amountReceived: string
  fee: string
  isReady: boolean
  executeTransaction: () => Promise<`0x${string}`>
  simulationError: string | null
  simulateTransaction: () => Promise<void>
  setSourceWallet: (wallet: WalletClient | undefined) => void
  setSourcePublicClient: (client: PublicClient | undefined) => void
}

export function useBridgeTransaction(
  amount: string,
  initialSourceWallet: WalletClient | undefined,
  initialSourcePublicClient: PublicClient | undefined,
  recipient: Address,
  oftAddress: Address,
  dstEid: number,
): BridgeTransactionReturn {
  const [details, setDetails] = useState<SimulatedTransactionDetails>({
    gasOnDestination: '--',
    amountReceived: '--',
    fee: '--',
    isReady: false,
  })

  const [sendParam, setSendParam] = useState<SendParam | null>(null)
  const [fee, setFee] = useState<Fee | null>(null)
  const [simulationError, setSimulationError] = useState<string | null>(null)

  const [sourceWallet, setSourceWallet] = useState<WalletClient | undefined>(initialSourceWallet)
  const [sourcePublicClient, setSourcePublicClient] = useState<PublicClient | undefined>(
    initialSourcePublicClient,
  )

  useEffect(() => {
    setSourceWallet(initialSourceWallet)
    setSourcePublicClient(initialSourcePublicClient)
  }, [initialSourceWallet, initialSourcePublicClient])

  const simulateTransaction = useCallback(async () => {
    if (!amount) {
      setSimulationError('Please enter an amount')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    if (!sourceWallet?.account || !sourcePublicClient) {
      setSimulationError('Wallet not connected')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    if (!recipient) {
      setSimulationError('Recipient address is required')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    try {
      const amountBigInt = parseEther(amount)
      const options = Options.newOptions().addExecutorLzReceiveOption(300000, 0).toBytes()
      const optionsHex = `0x${Buffer.from(options).toString('hex')}` as `0x${string}`
      const recipientHex =
        `0x${Buffer.from(addressToBytes32(recipient)).toString('hex')}` as `0x${string}`

      const param: SendParam = {
        dstEid,
        to: recipientHex,
        amountLD: amountBigInt,
        minAmountLD: amountBigInt,
        extraOptions: optionsHex,
        composeMsg: '0x',
        oftCmd: '0x',
      }

      const quotedFee = await sourcePublicClient.readContract({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'quoteSend',
        args: [param, false],
      })

      const gasEstimate = await sourcePublicClient.estimateContractGas({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'send',
        args: [
          param,
          { nativeFee: quotedFee[0], lzTokenFee: quotedFee[1] },
          sourceWallet.account.address,
        ],
        value: quotedFee[0],
        account: sourceWallet.account,
      })

      const gasPrice = await sourcePublicClient.getGasPrice()
      const sourceChainGasCost = gasEstimate * gasPrice

      setDetails({
        gasOnDestination: formatGwei(quotedFee[0]),
        amountReceived: formatEther(param.minAmountLD),
        fee: formatGwei(quotedFee[0] + sourceChainGasCost),
        isReady: true,
      })

      setSendParam(param)
      setFee({
        nativeFee: quotedFee[0],
        lzTokenFee: quotedFee[1],
      })

      setSimulationError(null)
    } catch (error) {
      console.error('Simulation failed:', error)
      handleSimulationError(error)
    }
  }, [amount, sourceWallet, sourcePublicClient, recipient, oftAddress, dstEid])

  const executeTransaction = async () => {
    if (!sourceWallet?.account || !sourcePublicClient) {
      throw new Error('Wallet not connected')
    }

    if (!sendParam || !fee) {
      throw new Error('Transaction must be simulated before executing')
    }

    try {
      await switchNetworkIfNeeded(sourceWallet)

      const { request } = await sourcePublicClient.simulateContract({
        account: sourceWallet.account,
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'send',
        args: [sendParam, fee, sourceWallet.account.address],
        value: fee.nativeFee,
      })

      return await sourceWallet.writeContract(request)
    } catch (error) {
      console.error('Transaction failed:', {
        error,
        wallet: sourceWallet.account,
        params: sendParam,
        fee,
      })
      throw error
    }
  }

  return {
    ...details,
    executeTransaction,
    simulationError,
    simulateTransaction,
    setSourceWallet,
    setSourcePublicClient,
  }
}
