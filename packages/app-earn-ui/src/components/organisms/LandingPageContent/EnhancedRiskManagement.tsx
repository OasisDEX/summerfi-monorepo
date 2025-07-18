import { type ReactNode } from 'react'
import clsx from 'clsx'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import { WithArrow } from '@/components/atoms/WithArrow/WithArrow'
import { BigGradientBox } from '@/components/molecules/BigGradientBox/BigGradientBox'
import { EXTERNAL_LINKS } from '@/helpers/application-links'

import enhancedRiskManagementStyles from './EnhancedRiskManagement.module.css'

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

export const EnhancedRiskManagement = ({
  protectedCapital,
  imagesMap,
  bottomBoxes = true,
}: {
  protectedCapital: string
  imagesMap: {
    rebalanceActivityImage: StaticImageData
    strategyExposureImage: StaticImageData
    blockAnalyticaLogo: StaticImageData
    aaveLogo: StaticImageData
    morphoBlueLogo: StaticImageData
    skyLogo: StaticImageData
    sparkLogo: StaticImageData
  }
  bottomBoxes?: boolean
}): ReactNode => {
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
            <Link
              href={EXTERNAL_LINKS.EARN.FORUM_BA_POST}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <WithArrow>
                <Text variant="p2">Learn more</Text>
              </WithArrow>
            </Link>
          </div>
          <div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <Image src={imagesMap.blockAnalyticaLogo} alt="Block Analytica" />
            </div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <div className={enhancedRiskManagementStyles.topBlockProtocolIcons}>
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.morphoBlueLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.sparkLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.skyLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.aaveLogo} />
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
      {bottomBoxes && (
        <div className={enhancedRiskManagementStyles.bottomBoxes}>
          <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxLeftGradient}>
            <div className={enhancedRiskManagementStyles.bottomBoxDescription}>
              <Text variant="h5" as="h5">
                Highest yields with minimum risk of ruin
              </Text>
              <Text variant="p2" as="p">
                The Risk Curator will set and continually manage all Vault parameters to prevent
                over exposure risk to any single protocol or collateral paired assets. Through their
                own models and experience, they will monitor and manage the risk ensuring the best
                risk adjusted yields.
              </Text>
            </div>
            <Image
              src={imagesMap.rebalanceActivityImage}
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
                Lazy Summer Protocol requires no management from users after they have deposited.
                All risk management, yield optimizing and strategy rebalancing is handled
                automatically within the parameters set by the Risk Curator. No chance of fat
                fingering a trade again.
              </Text>
            </div>
            <Image
              src={imagesMap.strategyExposureImage}
              alt="Automatic Diversified Exposure"
              placeholder="blur"
            />
          </BigGradientBox>
        </div>
      )}
    </div>
  )
}

export const EnhancedRiskManagementCampaign = ({
  protectedCapital,
  imagesMap,
}: {
  protectedCapital: string
  imagesMap: {
    blockAnalyticaLogo: StaticImageData
    aaveLogo: StaticImageData
    morphoBlueLogo: StaticImageData
    skyLogo: StaticImageData
    sparkLogo: StaticImageData
    liquidityImage: StaticImageData
    depositImage: StaticImageData
    nonCustodialImage: StaticImageData
  }
}): ReactNode => {
  return (
    <div
      className={clsx(
        enhancedRiskManagementStyles.enhancedRiskManagementWrapper,
        enhancedRiskManagementStyles.campaign,
      )}
    >
      <div className={enhancedRiskManagementStyles.enhancedRiskManagementHeaderWrapper}>
        <Text variant="h2" className={enhancedRiskManagementStyles.enhancedRiskManagementHeader}>
          Superior risk management by DeFi’s top risk team
        </Text>
      </div>
      <BigGradientBox reversed color="red">
        <div
          className={clsx(
            enhancedRiskManagementStyles.topBlock,
            enhancedRiskManagementStyles.campaign,
          )}
        >
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
            <Link
              href={EXTERNAL_LINKS.EARN.FORUM_BA_POST}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
              <WithArrow>
                <Text variant="p2">Learn more</Text>
              </WithArrow>
            </Link>
          </div>
          <div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <Image src={imagesMap.blockAnalyticaLogo} alt="Block Analytica" />
            </div>
            <div className={enhancedRiskManagementStyles.smallGradientBlock}>
              <div className={enhancedRiskManagementStyles.topBlockProtocolIcons}>
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.morphoBlueLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.sparkLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.skyLogo} />
                <EnhancedRiskManagementProtocolIcon protocolImage={imagesMap.aaveLogo} />
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
          <div
            className={clsx(
              enhancedRiskManagementStyles.bottomBoxDescription,
              enhancedRiskManagementStyles.campaign,
            )}
          >
            <Text variant="h5" as="h5">
              Never second guess the source of your yield
            </Text>
            <Text variant="p2" as="p">
              Summer ensures you never second guess the source of your yield. With our automated
              rebalances, every decision is fully traceable and optimized transparently.
            </Text>
          </div>
          <Image
            src={imagesMap.liquidityImage}
            alt="Never second guess the source of your yield"
            style={{ marginBottom: '30px' }}
          />
        </BigGradientBox>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxRightGradient}>
          <div
            className={clsx(
              enhancedRiskManagementStyles.bottomBoxDescription,
              enhancedRiskManagementStyles.campaign,
            )}
          >
            <Text variant="h5" as="h5">
              Exit anytime, no lockups or withdrawal delays
            </Text>
            <Text variant="p2" as="p">
              With Summer, you can withdraw from your position at anytime as long as the capital is
              available from the underlying protocols (which is almost always). No queues or waiting
              for withdrawals to be processed.
            </Text>
          </div>
          <Image
            src={imagesMap.depositImage}
            alt="Exit anytime, no lockups or withdrawal delays"
            placeholder="blur"
          />
        </BigGradientBox>
        <BigGradientBox className={enhancedRiskManagementStyles.bottomBoxLeftGradient}>
          <div
            className={clsx(
              enhancedRiskManagementStyles.bottomBoxDescription,
              enhancedRiskManagementStyles.campaign,
            )}
          >
            <Text variant="h5" as="h5">
              Always Non-Custodial, Always in Your Control
            </Text>
            <Text variant="p2" as="p">
              Built entirely on-chain, Summer gives you unrestricted access and complete control
              over your assets - no middle-men and no opaque third parties with control over your
              capital.
            </Text>
          </div>
          <Image
            src={imagesMap.nonCustodialImage}
            alt="Always Non-Custodial, Always in Your Control"
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
