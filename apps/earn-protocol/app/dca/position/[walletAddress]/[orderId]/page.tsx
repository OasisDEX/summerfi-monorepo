import { type FC } from 'react'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedUserDcaOrder } from '@/app/server-handlers/cached/get-user-dca-order'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { DCAPositionLoader } from '@/features/dca/components/DCAPositionView/DCAPositionLoader'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface DCAPositionPageProps {
  params: Promise<{ walletAddress: string; orderId: string }>
}

const DCAPositionPage: FC<DCAPositionPageProps> = async ({ params }) => {
  const { walletAddress, orderId } = await params

  const [order, { vaults }, configRaw] = await Promise.all([
    getCachedUserDcaOrder({ walletAddress, orderId }),
    getCachedVaultsList(),
    getCachedConfig(),
  ])

  if (!order) {
    notFound()
  }

  const systemConfig = parseServerResponseToClient(configRaw)
  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const fromVault = vaultsWithConfig.find(
    (vault) => vault.id.toLowerCase() === order.fromVault.toLowerCase(),
  )
  const toVault = vaultsWithConfig.find(
    (vault) => vault.id.toLowerCase() === order.toVault.toLowerCase(),
  )

  if (!fromVault || !toVault) {
    notFound()
  }

  return <DCAPositionLoader order={order} pair={{ fromVault, toVault }} />
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lazy Summer Protocol - DCA Position',
    description: 'View execution history and performance for your DCA strategy.',
  }
}

export default DCAPositionPage
