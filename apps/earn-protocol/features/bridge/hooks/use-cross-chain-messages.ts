import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient, type Message, MessageStatus } from '@layerzerolabs/scan-client'

interface UseCrossChainMessagesProps {
  srcTxHash?: string
  environment?: 'mainnet' | 'testnet'
  onSuccess: () => void
  onError?: () => void
}

interface UseCrossChainMessagesResult {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  latestStatus: MessageStatus | null
}

const getHighestPriorityStatus = (messages: Message[]): MessageStatus | null => {
  // Check for any failed messages first
  if (messages.some((msg) => msg.status === MessageStatus.FAILED)) {
    return MessageStatus.FAILED
  }
  // Then check for delivered messages
  if (messages.some((msg) => msg.status === MessageStatus.DELIVERED)) {
    return MessageStatus.DELIVERED
  }
  // Otherwise return the status of the first message (presumably INFLIGHT)
  return messages[0]?.status ?? null
}

const POLLING_INTERVAL = 10000 // 10 seconds

export function useCrossChainMessages({
  srcTxHash,
  environment = 'mainnet',
  onSuccess,
}: UseCrossChainMessagesProps): UseCrossChainMessagesResult {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [latestStatus, setLatestStatus] = useState<MessageStatus | null>(null)

  // Memoize the onSuccess callback to prevent unnecessary re-renders
  const memoizedOnSuccess = useCallback(onSuccess, [onSuccess])

  // Memoize the client creation
  const client = useMemo(() => createClient(environment), [environment])

  const fetchMessages = useCallback(async () => {
    if (!srcTxHash) return false

    try {
      setIsLoading(true)
      const response = await client.getMessagesBySrcTxHash(srcTxHash)

      setMessages(response.messages)
      setLatestStatus(getHighestPriorityStatus(response.messages))

      const foundDelivered = response.messages.some((msg) => msg.status === MessageStatus.DELIVERED)

      if (foundDelivered) {
        memoizedOnSuccess()
      }

      return !foundDelivered
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch LayerZero messages'))
      setLatestStatus(MessageStatus.FAILED)

      return false
    } finally {
      setIsLoading(false)
    }
  }, [srcTxHash, client, memoizedOnSuccess])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const poll = async () => {
      const shouldContinue = await fetchMessages()

      if (shouldContinue) {
        clearTimeout(intervalId)
        intervalId = setInterval(poll, POLLING_INTERVAL)
      }
    }

    // Start polling
    poll()

    // Cleanup on unmount or when srcTxHash changes
    return () => {
      clearInterval(intervalId)
    }
  }, [fetchMessages, srcTxHash])

  return {
    messages,
    isLoading,
    error,
    latestStatus,
  }
}
