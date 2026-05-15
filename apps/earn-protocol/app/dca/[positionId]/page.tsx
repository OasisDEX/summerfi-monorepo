import { type FC } from 'react'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { DCAPositionView } from '@/features/dca/components/DCAPositionView/DCAPositionView'
import { buildMockPosition } from '@/features/dca/lib/mock-position'
import { selectDCAVaults } from '@/features/dca/lib/select-dca-vaults'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface DCAPositionPageProps {
  params: Promise<{ positionId: string }>
}

const DCAPositionPage: FC<DCAPositionPageProps> = async ({ params }) => {
  const { positionId } = await params

  const [{ vaults }, configRaw] = await Promise.all([getCachedVaultsList(), getCachedConfig()])

  const systemConfig = parseServerResponseToClient(configRaw)
  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const { sourceVaults, targetVaults } = selectDCAVaults(vaultsWithConfig)
  const [fromVault] = sourceVaults
  const [toVault] = targetVaults

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'var(--general-space-32) var(--general-space-16)',
      }}
    >
      <DCAPositionView
        position={buildMockPosition(positionId)}
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        pair={fromVault && toVault ? { fromVault, toVault } : undefined}
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        sourceSymbol={fromVault.inputToken.symbol ?? 'USDC'}
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        targetSymbol={toVault.inputToken.symbol ?? 'ETH'}
      />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lazy Summer Protocol - DCA Position',
    description: 'View execution history and performance for your DCA strategy.',
  }
}

export default DCAPositionPage
