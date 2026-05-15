import { type FC } from 'react'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { DCANewView } from '@/features/dca/components/DCANewView/DCANewView'
import { selectDCAVaults } from '@/features/dca/lib/select-dca-vaults'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const DCANewPage: FC = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getCachedVaultsList(), getCachedConfig()])

  const systemConfig = parseServerResponseToClient(configRaw)
  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const { sourceVaults, targetVaults, pairs } = selectDCAVaults(vaultsWithConfig)

  return <DCANewView sourceVaults={sourceVaults} targetVaults={targetVaults} pairs={pairs} />
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lazy Summer Protocol - New DCA Strategy',
    description:
      'Schedule recurring purchases between Summer.fi vaults. Funds stay in your wallet between executions.',
  }
}

export default DCANewPage
