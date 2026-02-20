import { BigGradientBox, ProtocolStats, Text } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient, supportedSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import Image from 'next/image'

import { OkxClientComponents } from '@/app/campaigns/okx/components/ClientComponents'
import { OkxConnectButton } from '@/app/campaigns/okx/components/OkxConnectButton'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'
import okxHeaderImage from '@/public/img/campaigns/header-okx.svg'

import campaignPageStyles from '@/app/campaigns/CampaignPage.module.css'

export default async function OkxCampaignPage() {
  const [{ vaults }, configRaw, latestActivity] = await Promise.all([
    getCachedVaultsList(),
    getCachedConfig(),
    unstableCache(getPaginatedLatestActivity, ['latestActivity'], {
      revalidate: CACHE_TIMES.LP_REBALANCE_ACTIVITY,
      tags: [CACHE_TAGS.LP_REBALANCE_ACTIVITY],
    })({
      page: 1,
      limit: 1,
    }),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const daoManagedVaultsList = (
    await Promise.all(
      vaults.map(async (v) => {
        const isDaoManaged = await getCachedIsVaultDaoManaged({
          fleetAddress: v.id,
          network: supportedSDKNetwork(v.protocol.network),
        })

        return isDaoManaged ? v.id : false
      }),
    )
  ).filter(Boolean) as `0x${string}`[]

  const vaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig, daoManagedVaultsList })
  const { totalUniqueUsers } = latestActivity

  return (
    <div className={campaignPageStyles.wrapper}>
      <div className={campaignPageStyles.campaignGradientBox}>
        <BigGradientBox>
          <Image
            className={campaignPageStyles.campaignHeaderImage}
            src={okxHeaderImage}
            alt="Earn the best DeFi yields + bonus $SUMR only with OKX Wallet"
          />
        </BigGradientBox>
      </div>
      <div className={campaignPageStyles.campaignHeader}>
        <Text variant="h1" as="h1">
          Earn the best DeFi yields + bonus $SUMR only with OKX Wallet
        </Text>
        <Text variant="p1" as="p">
          Connect to Summer.fi with your OKX wallet and use the Lazy Summer Protocol to earn the
          best yields from the best protocols automatically. Plus, complete the exclusive OKX quests
          and earn bonus $SUMR.
        </Text>
        <OkxConnectButton />
      </div>
      <ProtocolStats vaultsList={vaultsWithConfig} noMargin totalUniqueUsers={totalUniqueUsers} />
      <OkxClientComponents />
    </div>
  )
}
