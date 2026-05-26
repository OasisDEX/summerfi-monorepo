import { type FC } from 'react'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { ChainIds } from '@summerfi/sdk-common'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedUserDcaOrder } from '@/app/server-handlers/cached/get-user-dca-order'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { DCAPositionLoader } from '@/features/dca/components/DCAPositionView/DCAPositionLoader'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface DCAPositionPageProps {
  params: Promise<{ orderId: string }>
}

const DCAPositionPage: FC<DCAPositionPageProps> = async ({ params }) => {
  const { orderId } = await params

  const [order, { vaults }, configRaw] = await Promise.all([
    getCachedUserDcaOrder({ chainId: ChainIds.Base, orderId }),
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
    (vault) =>
      vault.id.toLowerCase() === order.sourceVault.toLowerCase() &&
      subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network)) === order.chainId,
  )
  const toVault = vaultsWithConfig.find(
    (vault) =>
      vault.id.toLowerCase() === order.targetVault.toLowerCase() &&
      subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network)) === order.chainId,
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
