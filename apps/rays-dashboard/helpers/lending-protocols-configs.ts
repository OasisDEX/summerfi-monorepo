import keyBy from 'lodash-es/keyBy'
import aaveIcon from 'public/img/protocol_icons/aave_icon.svg'
import aaveV2Logo from 'public/img/protocol_icons/aave_v2_logo.svg'
import aaveV3Logo from 'public/img/protocol_icons/aave_v3_logo.svg'
import ajnaIcon from 'public/img/protocol_icons/ajna_icon.svg'
import ajnaLogo from 'public/img/protocol_icons/ajna_logo.svg'
import makerIcon from 'public/img/protocol_icons/maker_icon.svg'
import makerLogo from 'public/img/protocol_icons/maker_logo.svg'
import morphoBlueIcon from 'public/img/protocol_icons/morpho_blue_icon.svg'
import morphoBlueLogo from 'public/img/protocol_icons/morpho_blue_logo.svg'
import skyIcon from 'public/img/protocol_icons/sky.svg'
import sparkIcon from 'public/img/protocol_icons/spark_icon.svg'
import sparkLogo from 'public/img/protocol_icons/spark_logo.svg'

import { LendingProtocol, LendingProtocolLabel } from '@/helpers/lending-protocol'

export type LendingProtocolConfig = {
  name: LendingProtocol | 'aave3'
  label: LendingProtocolLabel
  icon: string
  logo: string
  logoScale: number
}

const aaveV2Config: LendingProtocolConfig = {
  name: LendingProtocol.AaveV2,
  label: LendingProtocolLabel.aavev2,
  icon: aaveIcon as string,
  logo: aaveV2Logo as string,
  logoScale: 1,
}

const aaveV3Config: LendingProtocolConfig = {
  name: LendingProtocol.AaveV3,
  label: LendingProtocolLabel.aavev3,
  icon: aaveIcon as string,
  logo: aaveV3Logo as string,
  logoScale: 1,
}

// "protocolId": "aave3"
// ?????????
const aave3Config: LendingProtocolConfig = {
  ...aaveV3Config,
  name: 'aave3',
}

const ajnaConfig: LendingProtocolConfig = {
  name: LendingProtocol.Ajna,
  label: LendingProtocolLabel.ajna,
  icon: ajnaIcon as string,
  logo: ajnaLogo as string,
  logoScale: 1.1,
}

const makerConfig: LendingProtocolConfig = {
  name: LendingProtocol.Maker,
  label: LendingProtocolLabel.maker,
  icon: makerIcon as string,
  logo: makerLogo as string,
  logoScale: 1,
}

const morphoBlueConfig: LendingProtocolConfig = {
  name: LendingProtocol.MorphoBlue,
  label: LendingProtocolLabel.morphoblue,
  icon: morphoBlueIcon as string,
  logo: morphoBlueLogo as string,
  logoScale: 1.4,
}

const sparkConfig: LendingProtocolConfig = {
  name: LendingProtocol.SparkV3,
  label: LendingProtocolLabel.sparkv3,
  icon: sparkIcon as string,
  logo: sparkLogo as string,
  logoScale: 1.2,
}

const skyConfig: LendingProtocolConfig = {
  name: LendingProtocol.Sky,
  label: LendingProtocolLabel.sky,
  icon: skyIcon as string,
  logo: skyIcon as string,
  logoScale: 1.6,
}

const lendingProtocols = [
  aaveV2Config,
  aaveV3Config,
  aave3Config,
  ajnaConfig,
  makerConfig,
  morphoBlueConfig,
  sparkConfig,
  skyConfig,
]

export const lendingProtocolsByName: { [key: string]: LendingProtocolConfig } = keyBy(
  lendingProtocols,
  'name',
)
