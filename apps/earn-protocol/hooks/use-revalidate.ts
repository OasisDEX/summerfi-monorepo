import { useRouter } from 'next/navigation'

import {
  serverRevalidateMigrationData,
  serverRevalidatePositionData,
  serverRevalidateUser,
  serverRevalidateVaultsListData,
} from '@/app/server-handlers/revalidation-handlers'

export const useRevalidateUser = () => {
  const { refresh } = useRouter()

  return async (walletAddress?: string) => {
    await serverRevalidateUser(walletAddress)
    refresh()
  }
}

export const useRevalidateVaultsListData = () => {
  const { refresh } = useRouter()

  return async () => {
    await serverRevalidateVaultsListData()
    refresh()
  }
}

export const useRevalidatePositionData = () => {
  const { refresh } = useRouter()

  return async ({
    chainName,
    vaultId,
    walletAddress,
  }: {
    chainName?: string
    vaultId?: string
    walletAddress?: string
  }) => {
    await serverRevalidatePositionData(chainName, vaultId, walletAddress)
    refresh()
  }
}

export const useRevalidateMigrationData = () => {
  const { refresh } = useRouter()

  return async (walletAddress?: string) => {
    await serverRevalidateMigrationData(walletAddress)
    refresh()
  }
}
