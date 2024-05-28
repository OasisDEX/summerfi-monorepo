import { keyBy } from 'lodash'
import aaveIcon from 'public/img/protocol_icons/aave_icon.svg'
import aaveV2Logo from 'public/img/protocol_icons/aave_v2_logo.svg'
import aaveV3Logo from 'public/img/protocol_icons/aave_v3_logo.svg'
import ajnaIcon from 'public/img/protocol_icons/ajna_icon.svg'
import ajnaLogo from 'public/img/protocol_icons/ajna_logo.svg'
import makerIcon from 'public/img/protocol_icons/maker_icon.svg'
import makerLogo from 'public/img/protocol_icons/maker_logo.svg'
import morphoBlueIcon from 'public/img/protocol_icons/morpho_blue_icon.svg'
import morphoBlueLogo from 'public/img/protocol_icons/morpho_blue_logo.svg'
import sparkIcon from 'public/img/protocol_icons/spark_icon.svg'
import sparkLogo from 'public/img/protocol_icons/spark_logo.svg'

import { LendingProtocol, LendingProtocolLabel } from '@/helpers/lending-protocol'

export type LendingProtocolConfig = {
  name: LendingProtocol
  label: LendingProtocolLabel
  icon: string
  logo: string
  logoScale: number
  gradient: string
}

const aaveV2Config: LendingProtocolConfig = {
  name: LendingProtocol.AaveV2,
  label: LendingProtocolLabel.aavev2,
  icon: aaveIcon as string,
  logo: aaveV2Logo as string,
  logoScale: 1,
  gradient: 'linear-gradient(230deg, #B6509E 15.42%, #2EBAC6 84.42%)',
}

const aaveV3Config: LendingProtocolConfig = {
  name: LendingProtocol.AaveV3,
  label: LendingProtocolLabel.aavev3,
  icon: aaveIcon as string,
  logo: aaveV3Logo as string,
  logoScale: 1,
  gradient: 'linear-gradient(230deg, #B6509E 15.42%, #2EBAC6 84.42%)',
}

const ajnaConfig: LendingProtocolConfig = {
  name: LendingProtocol.Ajna,
  label: LendingProtocolLabel.ajna,
  icon: ajnaIcon as string,
  logo: ajnaLogo as string,
  logoScale: 1,
  gradient: 'linear-gradient(90deg, #F154DB 0%, #974EEA 100%)',
}

const makerConfig: LendingProtocolConfig = {
  name: LendingProtocol.Maker,
  label: LendingProtocolLabel.maker,
  icon: makerIcon as string,
  logo: makerLogo as string,
  logoScale: 1,
  gradient: 'linear-gradient(135deg, #2DC1B1 0%, #139D8D 100%)',
}

const morphoBlueConfig: LendingProtocolConfig = {
  name: LendingProtocol.MorphoBlue,
  label: LendingProtocolLabel.morphoblue,
  icon: morphoBlueIcon as string,
  logo: morphoBlueLogo as string,
  logoScale: 1.2,
  gradient: 'linear-gradient(90deg, rgba(24,89,242,1) 0%, rgba(0,55,138,1) 100%)',
}

const sparkConfig: LendingProtocolConfig = {
  name: LendingProtocol.SparkV3,
  label: LendingProtocolLabel.sparkv3,
  icon: sparkIcon as string,
  logo: sparkLogo as string,
  logoScale: 1.1,
  gradient: 'linear-gradient(159deg, #F58013 12.26%, #F19D19 86.52%)',
}

const lendingProtocols = [
  aaveV2Config,
  aaveV3Config,
  ajnaConfig,
  makerConfig,
  morphoBlueConfig,
  sparkConfig,
]

export const lendingProtocolsByName = keyBy(lendingProtocols, 'name')
