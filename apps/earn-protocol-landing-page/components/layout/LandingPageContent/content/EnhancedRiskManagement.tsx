import { BigGradientBox, Text } from '@summerfi/app-earn-ui'
import Image, { type StaticImageData } from 'next/image'

import blockAnalyticaLogo from '@/public/img/landing-page/block-analytica.svg'
import aaveLogo from '@/public/img/landing-page/protocols/aave.svg'
import morphoBlueLogo from '@/public/img/landing-page/protocols/morpho-blue.svg'
import skyLogo from '@/public/img/landing-page/protocols/sky.svg'
import sparkLogo from '@/public/img/landing-page/protocols/spark.svg'

import enhancedRiskManagementStyles from '@/components/layout/LandingPageContent/content/EnhancedRiskManagement.module.css'

import rebalanceActivityImage from '@/public/img/landing-page/enhanced-risk-management_rebalance-activity.png'
import strategyExposureImage from '@/public/img/landing-page/enhanced-risk-management_strategy-exposure.png'

const EnhancedRiskManagementProtocolIcon = ({
  protocolImage,
}: {
  protocolImage: StaticImageData
}) => {
  return (
    <div className={enhancedRiskManagementStyles.protocolIcon}>
      <Image src={protocolImage} alt="" />
    </div>
  )
}

export const EnhancedRiskManagement = ({ protectedCapital }: { protectedCapital: string }) => {
  return (
    <div className={enhancedRiskManagementStyles.enhancedRiskManagementWrapper}>
      <div className={enhancedRiskManagementStyles.enhancedRiskManagementHeaderWrapper}>
        <Text variant="h2" className={enhancedRiskManagementStyles.enhancedRiskManagementHeader}>
          Superior risk management by DeFi’s top risk team
        </Text>
      </div>
      <BigGradientBox reversed color="red">
        <div className={enhancedRiskManagementStyles.topBlock}>
          <div className={enhancedRiskManagementStyles.topBlockDescription}>
            <Text variant="h5" as="h5">
              Your capital’s safety and diversification overseen and constantly assessed
            </Text>
            <Text variant="p2" as="p">
              Block Analitica is the Risk Curator to the Lazy Summer Protocol, who will set and
              manage all the core risk parameters. They come to Lazy Summer Protocol with a wealth
              of experience, using sophisticated models to simulate market conditions and their own
              knowledge to prevent any unnecessary risks taken to the protocol.
            </Text>
          </div>
          <div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <Image src={blockAnalyticaLogo} alt="Block Analytica" />
            </div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <div className={enhancedRiskManagementStyles.topBlockProtocolIcons}>
                <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={sparkLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={skyLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={aaveLogo} />
              </div>
              <div className={enhancedRiskManagementStyles.protectedCapital}>
                <Text variant="p3semi" as="p">
                  Protected Capital
                </Text>
                <Text variant="h4colorful" as="h4">
                  {protectedCapital}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </BigGradientBox>
      <div className={enhancedRiskManagementStyles.bottomBoxes}>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxLeftGradient}>
          <div className={enhancedRiskManagementStyles.bottomBoxDescription}>
            <Text variant="h5" as="h5">
              Highest yields with minimum risk of ruin
            </Text>
            <Text variant="p2" as="p">
              The Risk Curator will set and continually manage all Vault parameters to prevent over
              exposure risk to any single protocol or collateral paired assets. Through their own
              models and experience, they will monitor and manage the risk ensuring the best risk
              adjusted yields.
            </Text>
          </div>
          <Image
            src={rebalanceActivityImage}
            alt="Highest yields with minimum risk of ruin"
            placeholder="blur"
          />
        </BigGradientBox>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxRightGradient}>
          <div className={enhancedRiskManagementStyles.bottomBoxDescription}>
            <Text variant="h5" as="h5">
              Automatic Diversified Exposure
            </Text>
            <Text variant="p2" as="p">
              Lazy Summer Protocol requires no management from users after they have deposited. All
              risk management, yield optimizing and strategy rebalancing is handled automatically
              within the parameters set by the Risk Curator. No chance of fat fingering a trade
              again.
            </Text>
          </div>
          <Image
            src={strategyExposureImage}
            alt="Automatic Diversified Exposure"
            placeholder="blur"
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
