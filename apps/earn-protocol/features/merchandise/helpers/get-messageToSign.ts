import { type MerchandiseType } from '@/features/merchandise/types'

export const getMerchandiseMessageToSign = ({
  walletAddress,
  type,
}: {
  walletAddress: string
  type: MerchandiseType
}) => `I'm claiming my ${type} Beach Club reward as ${walletAddress}`
