import { BigGradientBox, Text } from '@summerfi/app-earn-ui'
import Image, { type StaticImageData } from 'next/image'

import blockAnalyticaLogo from '@/public/img/landing-page/block-analytica.svg'
import morphoBlueLogo from '@/public/img/landing-page/protocols/morpho-blue.svg' // add the others

import enhancedRiskManagementStyles from '@/components/layout/LandingPageContent/content/EnhancedRiskManagement.module.scss'

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
          Enhanced risk management with time-saving automation.
        </Text>
      </div>
      <BigGradientBox reversed color="red">
        <div className={enhancedRiskManagementStyles.topBlock}>
          <div className={enhancedRiskManagementStyles.topBlockDescription}>
            <Text variant="h5" as="h5">
              Your capital’s safety, overseen and constantly assessed by DeFi’s premier risk team
            </Text>
            <Text variant="p2" as="p">
              In the Lazy Summer Protocol, Block Analitica is the third party risk curator that
              provides objective analysis to critical protocol decisions.
            </Text>
            <div className={enhancedRiskManagementStyles.topBlockStats}>
              <Image src={blockAnalyticaLogo} alt="Block Analytica" />
              <div className={enhancedRiskManagementStyles.topBlockStatsData}>
                <Text variant="h2colorful" as="h2">
                  {protectedCapital}
                </Text>
                <Text variant="p3semi" as="p">
                  Protected Capital
                </Text>
              </div>
            </div>
          </div>
          <div className={enhancedRiskManagementStyles.topBlockProtocolIcons}>
            {/** Add proper/final logos */}
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
            <EnhancedRiskManagementProtocolIcon protocolImage={morphoBlueLogo} />
          </div>
        </div>
      </BigGradientBox>
      <div className={enhancedRiskManagementStyles.bottomBoxes}>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxLeftGradient}>
          <div className={enhancedRiskManagementStyles.bottomBoxDescription}>
            <Text variant="h5" as="h5">
              No more wasted time signing, approving, confirming
            </Text>
            <Text variant="p2" as="p">
              Get back all the time, effort and mental energy it takes to manually execute
              transactions on chain. In Lazy Summer, its all set and forget.
            </Text>
          </div>
          <Image
            src={rebalanceActivityImage}
            alt="No more wasted time signing, approving, confirming"
            placeholder="blur"
          />
        </BigGradientBox>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxRightGradient}>
          <div className={enhancedRiskManagementStyles.bottomBoxDescription}>
            <Text variant="h5" as="h5">
              Automatic diversification, zero chance of manual mistakes
            </Text>
            <Text variant="p2" as="p">
              Never be overexposed to a single protocol and risk the chance of ruin, and with
              automated the transactions, the chances of you fat fingering a trade just become zero.
            </Text>
          </div>
          <Image
            src={strategyExposureImage}
            alt="Automatic diversification, zero chance of manual mistakes"
            placeholder="blur"
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
