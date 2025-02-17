'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSendUserOperation, useSmartAccountClient } from '@account-kit/react'
import { addressToBytes32, Options } from '@layerzerolabs/lz-v2-utilities'
import { useIsIframe } from '@summerfi/app-earn-ui'
import {
  type Address,
  type Chain,
  encodeFunctionData,
  formatEther,
  formatGwei,
  parseEther,
  type PublicClient,
} from 'viem'

import { accountType } from '@/account-kit/config'
import { OFT_ABI } from '@/features/bridge/constants/abi'
import { type Fee, type SendParam } from '@/features/bridge/types'
import { getGasSponsorshipOverride } from '@/helpers/get-gas-sponsorship-override'
import { sendSafeTx } from '@/helpers/send-safe-tx'

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

interface BridgeTransactionParams {
  amount: string
  sourceChain: Chain
  destinationChain: Chain
  recipient: Address
  externalData: any
  onSuccess?: () => void
  onError?: () => void
}

export function useBridgeTransaction({
  amount,
  sourceChain,
  destinationChain,
  recipient,
  externalData,
  onSuccess,
  onError,
}: BridgeTransactionParams) {
  const [details, setDetails] = useState({
    gasOnSource: '--',
    amountReceived: '--',
    lzFee: '--',
    isReady: false,
  })
  const [sendParam, setSendParam] = useState<SendParam | null>(null)
  const [fee, setFee] = useState<Fee | null>(null)
  const [simulationError, setSimulationError] = useState<string | null>(null)
  const [oftAddress, setOftAddress] = useState<Address>()
  const [dstEid, setDstEid] = useState<number>()

  const isIframe = useIsIframe()
  const { client: smartAccountClient } = useSmartAccountClient({ type: accountType })

  // Set up OFT address and destination EID based on chains
  useEffect(() => {
    if (sourceChain && destinationChain) {
      // Get OFT address for source chain
      const oftAddress = externalData?.oftAddresses?.[sourceChain.id]

      setOftAddress(oftAddress)

      // Get destination endpoint ID for LayerZero
      const dstEid = externalData?.chainToEid?.[destinationChain.id]

      setDstEid(dstEid)
    }
  }, [sourceChain, destinationChain, externalData])

  const { sendUserOperationAsync: sendBridgeTransaction, isSendingUserOperation: isSending } =
    useSendUserOperation({
      client: smartAccountClient,
      waitForTxn: true,
      onSuccess,
      onError,
    })

  const simulateTransaction = useCallback(async () => {
    if (!amount) {
      setSimulationError('Please enter an amount')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    if (!recipient) {
      setSimulationError('Recipient address is required')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    if (!oftAddress || !dstEid) {
      setSimulationError('Bridge configuration not ready')
      setDetails((prev) => ({ ...prev, isReady: false }))
      return
    }

    try {
      const amountBigInt = parseEther(amount)
      const options = Options.newOptions().addExecutorLzReceiveOption(300000, 0).toBytes()
      const optionsHex = `0x${Buffer.from(options).toString('hex')}` as `0x${string}`
      const recipientHex =
        `0x${Buffer.from(addressToBytes32(recipient)).toString('hex')}` as `0x${string}`

      // Quote the fee for the cross-chain transaction
      const quotedFee = await smartAccountClient.readContract({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'quoteSendFee',
        args: [dstEid, recipientHex, amountBigInt, false, optionsHex],
      })

      // Estimate gas on destination chain
      const gasEstimate = await smartAccountClient.readContract({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'estimateGas',
        args: [dstEid, recipientHex, amountBigInt, false, optionsHex],
      })

      const param: SendParam = {
        dstEid,
        to: recipientHex,
        amountLD: amountBigInt,
        minAmountLD: amountBigInt,
        extraOptions: optionsHex,
        composeMsg: '0x',
        oftCmd: '0x',
      }

      const simulatedFee = {
        nativeFee: quotedFee[0],
        lzTokenFee: quotedFee[1],
      }

      setSendParam(param)
      setFee(simulatedFee)
      setSimulationError(null)
      setDetails({
        gasOnSource: formatGwei(gasEstimate),
        amountReceived: formatEther(param.minAmountLD),
        lzFee: formatEther(simulatedFee.nativeFee),
        isReady: true,
      })
    } catch (error) {
      console.error('Simulation failed:', error)
      handleSimulationError(error)
    }
  }, [amount, recipient, dstEid, oftAddress, smartAccountClient])

  const executeBridgeTransaction = async () => {
    if (!sendParam || !fee || !oftAddress) {
      throw new Error('Transaction must be simulated before executing')
    }

    try {
      const encodedData = encodeFunctionData({
        abi: OFT_ABI,
        functionName: 'sendFrom',
        args: [
          recipient,
          sendParam.dstEid,
          sendParam.to,
          sendParam.amountLD,
          sendParam.minAmountLD,
          {
            extraOptions: sendParam.extraOptions,
            composeMsg: sendParam.composeMsg,
            oftCmd: sendParam.oftCmd,
          },
        ],
      })

      if (isIframe) {
        return await sendSafeTx({
          txs: [
            {
              to: oftAddress,
              data: encodedData,
              value: fee.nativeFee,
            },
          ],
          onSuccess,
          onError,
        })
      }

      const txParams = {
        target: oftAddress,
        data: encodedData,
        value: fee.nativeFee,
      }

      const resolvedOverrides = await getGasSponsorshipOverride({
        smartAccountClient,
        txParams,
      })

      return await sendBridgeTransaction({
        uo: txParams,
        overrides: resolvedOverrides,
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  return {
    ...details,
    simulationError,
    isLoading: isSending,
    simulateTransaction,
    executeBridgeTransaction,
  }
}
