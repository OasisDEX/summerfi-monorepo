import {
  Audits,
  BigGradientBox,
  EffortlessAccessBlock,
  EnhancedRiskManagementCampaign,
  FaqSection,
  ProtocolStats,
  SectionTabs,
  SupportedNetworksList,
  Text,
} from '@summerfi/app-earn-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import Image from 'next/image'

import { OkxConnectButton } from '@/app/campaigns/okx/components/OkxConnectButton'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'
import chainSecurityLogo from '@/public/img/campaigns/auditor-logos/chainsecurity.svg'
import prototechLabsLogo from '@/public/img/campaigns/auditor-logos/prototech-labs.svg'
import blockAnalyticaLogo from '@/public/img/campaigns/block-analytica.svg'
import okxHeaderImage from '@/public/img/campaigns/header-okx.svg'
import liquidityImage from '@/public/img/campaigns/liquidity.svg'
import arbitrumLogo from '@/public/img/campaigns/networks/arbitrum.svg'
import baseLogo from '@/public/img/campaigns/networks/base.svg'
import ethereumLogo from '@/public/img/campaigns/networks/ethereum.svg'
import nonCustodialImage from '@/public/img/campaigns/non-custodial.svg'
import aaveLogo from '@/public/img/campaigns/protocols/aave.svg'
import morphoBlueLogo from '@/public/img/campaigns/protocols/morpho-blue.svg'
import skyLogo from '@/public/img/campaigns/protocols/sky.svg'
import sparkLogo from '@/public/img/campaigns/protocols/spark.svg'

import campaignPageStyles from '@/app/campaigns/CampaignPage.module.css'
import okxCampaignStyles from '@/app/campaigns/okx/OkxCampaign.module.css'

import depositImage from '@/public/img/campaigns/deposit.png'
import summerEarnUi from '@/public/img/campaigns/summer-earn-ui.png'

const quests = [
  {
    id: 'quest-1',
    title: 'Quest 1 - Deposit USDC, EURC or ETH on Base',
    content: (
      <div className={okxCampaignStyles.sectionTabDescription}>
        <Text variant="p1semi" as="p">
          Quest 1 - Deposit USDC, EURC or ETH on Base
        </Text>
        <Text variant="p1" as="p">
          To complete the first quest, simply deposit at least 100 USDC or EURC, or at least 0.1 ETH
          into one of the Vaults on Base network from your OKX Wallet.
        </Text>
        <Text variant="p1" as="p">
          Reward: 5 SUMR
        </Text>
      </div>
    ),
  },
  {
    id: 'quest-2',
    title: 'Quest 2 - Keep earning for 7 days',
    content: (
      <div className={okxCampaignStyles.sectionTabDescription}>
        <Text variant="p1semi" as="p">
          Quest 2 - Keep earning for 7 days
        </Text>
        <Text variant="p1" as="p">
          Keep your deposit from Quest 1 in Summer.fi for at least 7 days and see how much more you
          have earned, and how much time you have saved.
        </Text>
        <Text variant="p1" as="p">
          Reward: 5 SUMR
        </Text>
      </div>
    ),
  },
  {
    id: 'quest-3',
    title: 'Quest 3 - Claim SUMR tokens',
    content: (
      <div className={okxCampaignStyles.sectionTabDescription}>
        <Text variant="p1semi" as="p">
          Quest 3 - Claim SUMR tokens
        </Text>
        <Text variant="p1" as="p">
          Once you have completed Quest 2, and earned SUMR for your deposits into the Vaults in
          Quest 1, claim your SUMR tokens from your portfolio page.
        </Text>
        <Text variant="p1" as="p">
          Reward: 5 SUMR
        </Text>
      </div>
    ),
  },
  {
    id: 'quest-4',
    title: 'Quest 4 - Stake and Delegate your earned SUMR',
    content: (
      <div className={okxCampaignStyles.sectionTabDescription}>
        <Text variant="p1semi" as="p">
          Quest 4 - Stake and Delegate SUMR tokens
        </Text>
        <Text variant="p1" as="p">
          Once you have completed Quest 3, and claimed your SUMR tokens. Stake them through the
          portfolio page, and pick a delegate. Not only do you contribute to the Lazy Summer
          Protocol, but you will continue to earn even more SUMR.
        </Text>
        <Text variant="p1" as="p">
          Reward: 5 SUMR
        </Text>
      </div>
    ),
  },
]

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
        <OkxConnectButton />
      </div>
      <ProtocolStats vaultsList={vaultsWithConfig} noMargin />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '64px' }}>
        <Text variant="h2" as="h2">
          Exclusive quests for OKX Wallet users
        </Text>
        <SectionTabs sections={quests} wrapperStyle={{ paddingTop: 0 }} />
      </div>
      <div className={campaignPageStyles.campaignInlineHeader}>
        <Text variant="h2" as="h2">
          100,000 $SUMR up for grabs
        </Text>
        <Text variant="p1" as="p">
          This offer is limited to the first 5,000 users to complete the four quests, and earn a
          share of 100,000 SUMR tokens available. The SUMR will be paid out within 2 weeks of the
          campaign finishing, and will be claimable through the portfolio page of Summer.fi
        </Text>
      </div>
      <BigGradientBox>
        <EffortlessAccessBlock uiImage={summerEarnUi} />
        <SupportedNetworksList
          networks={[
            { name: 'Ethereum', logo: ethereumLogo },
            { name: 'Base', logo: baseLogo },
            { name: 'Arbitrum', logo: arbitrumLogo },
          ]}
        />
      </BigGradientBox>
      <EnhancedRiskManagementCampaign
        protectedCapital="$10B+"
        imagesMap={{
          blockAnalyticaLogo,
          aaveLogo,
          morphoBlueLogo,
          skyLogo,
          sparkLogo,
          depositImage,
          liquidityImage,
          nonCustodialImage,
        }}
      />
      <Audits chainSecurityLogo={chainSecurityLogo} prototechLabsLogo={prototechLabsLogo} />
      <FaqSection
        // headerClassName={classNames.faqSectionHeaderWrapper}
        // faqSectionClassName={classNames.faqSectionBlockWrapper}
        customTitle="Frequently Asked Questions"
        data={[
          {
            title: 'Do I have to use OKX wallet to complete the quests?',
            content: <div>TBD</div>,
          },
          {
            title: 'When will the SUMR for quests be paid out?',
            content: <div>TBD</div>,
          },
          {
            title: 'How do you know I’m using an OKX Wallet?',
            content: <div>TBD</div>,
          },
          {
            title: 'What is Summer.fi?',
            content: <div>TBD</div>,
          },
          {
            title: 'Where does the yield come from?',
            content: <div>TBD</div>,
          },
        ]}
      />
    </div>
  )
}
