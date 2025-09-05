import {
  BigGradientBox,
  ProtocolStats,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
  Text,
} from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import Image from 'next/image'

import { OkxClientComponents } from '@/app/campaigns/okx/components/ClientComponents'
import { OkxConnectButton } from '@/app/campaigns/okx/components/OkxConnectButton'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'
import okxHeaderImage from '@/public/img/campaigns/header-okx.svg'

import campaignPageStyles from '@/app/campaigns/CampaignPage.module.css'

export default async function OkxCampaignPage() {
  const [{ vaults }, configRaw] = await Promise.all([
    getVaultsList(),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

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
      <ProtocolStats vaultsList={vaultsWithConfig} noMargin />
      <OkxClientComponents />
    </div>
  )
}
