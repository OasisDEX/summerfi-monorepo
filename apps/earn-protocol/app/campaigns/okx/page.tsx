import { BigGradientBox, Button, ProtocolStats, Text } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import Image from 'next/image'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'
import okxHeaderImage from '@/public/img/campaigns/header-okx.svg'

import campaignPageStyles from '@/features/campaign-page/CampaignPage.module.css'

export default async function OkxCampaignPage() {
  const [{ vaults }, systemConfig] = await Promise.all([getVaultsList(), systemConfigHandler()])

  const { config } = parseServerResponseToClient(systemConfig)

  const vaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig: config })

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
        <Button variant="primaryLargeColorful">Connect your OKX Wallet</Button>
      </div>
      <ProtocolStats vaultsList={vaultsWithConfig} noMargin />
      <Text variant="h2" as="h2">
        Exclusive quests for OKX Wallet users
      </Text>
    </div>
  )
}
