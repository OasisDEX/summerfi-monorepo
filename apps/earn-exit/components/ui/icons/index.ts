import { CloseIcon } from './CloseIcon'
import { NotSupportedIcon } from './NotSupportedIcon'
import { NetworkEthereumIcon } from './NetworkEthereumIcon'
import { NetworkBaseIcon } from './NetworkBaseIcon'
import { NetworkArbitrumIcon } from './NetworkArbitrumIcon'
import { NetworkSonicIcon } from './NetworkSonicIcon'
import { NetworkHyperliquidIcon } from './NetworkHyperliquidIcon'
import { UsdcIcon } from './UsdcIcon'
import { UsdtIcon } from './UsdtIcon'
import { Usdt0Icon } from './Usdt0Icon'
import { EtherIcon } from './EtherIcon'
import { WethIcon } from './WethIcon'
import { EurcIcon } from './EurcIcon'
import { SumrIcon } from './SumrIcon'

export const icons = {
  'close': CloseIcon,
  'not_supported_icon': NotSupportedIcon,
  'earn_network_ethereum': NetworkEthereumIcon,
  'earn_network_base': NetworkBaseIcon,
  'earn_network_arbitrum': NetworkArbitrumIcon,
  'earn_network_sonic': NetworkSonicIcon,
  'earn_network_hyperliquid': NetworkHyperliquidIcon,
  'usdc_circle_color': UsdcIcon,
  'usdt_circle_color': UsdtIcon,
  'usd₮0_circle_color': Usdt0Icon,
  'ether_circle_color': EtherIcon,
  'weth_circle_color': WethIcon,
  'eurc': EurcIcon,
  'sumr': SumrIcon,
}

export type IconNamesList = keyof typeof icons
