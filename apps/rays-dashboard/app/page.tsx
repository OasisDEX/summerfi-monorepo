import {
  Button,
  Dial,
  GenericTokenIcon,
  Icon,
  ProtocolLabel,
  Text,
  TokensGroup,
  Tooltip,
} from '@summerfi/app-ui'
import Link from 'next/link'

import { BoostCards } from '@/components/molecules/BoostCards/BoostCards'
import { automationItems, ProductCard } from '@/components/molecules/ProductCard'
import { NetworkNames, networksByName } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

export default function HomePage() {
  const aaveV3Config = lendingProtocolsByName[LendingProtocol.AaveV3]

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Icon tokenName="ADAI" />
      <Icon iconName="arb" />
      <TokensGroup tokens={['CRV', 'AETHCBETH', 'CUSDCV3', 'XETH', 'DETH', 'GUNIV3DAIUSDC2']} />
      <Text>Text component</Text>
      <Text as="p">Text component as p</Text>
      <Text as="p" variant="p1">
        Text component as p with p1 variant
      </Text>
      <Text as="p" variant="p1" style={{ color: 'var(--color-text-interactive' }}>
        Text component as p with p1 variant and inline styles
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{ color: 'var(--color-text-interactive' }}
        className="extra-class"
      >
        Text component as p with p1 variant, inline styles and additional class (check in devtools)
      </Text>
      <Button variant="primaryLarge">Primary large</Button>
      <Button variant="primarySmall">Primary small</Button>
      <Button variant="secondaryLarge">Secondary large</Button>
      <Button variant="secondarySmall">Secondary small</Button>
      <Button variant="neutralLarge">Neutral large</Button>
      <Button variant="neutralSmall">Neutral small</Button>

      <GenericTokenIcon variant="smallIcon" symbol="hehe" />
      <ProtocolLabel
        protocol={{
          label: aaveV3Config.label,
          logo: { scale: aaveV3Config.logoScale, src: aaveV3Config.logo },
        }}
        network={{
          badge: networksByName[NetworkNames.ethereumMainnet].badge,
          label: aaveV3Config.label,
        }}
      />

      <Tooltip tooltip="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries">
        <Icon tokenName="WBTC" />
      </Tooltip>

      <Text as="p" variant="p2semi">
        Text component p with p2semi variant with <Link href="/">link</Link> inline
      </Text>
      <ProductCard
        automation={automationItems}
        protocolConfig={aaveV3Config}
        tokens={['ETH', 'DAI']}
        network={NetworkNames.baseMainnet}
        btn={{
          link: '/',
          label: 'Earn xxx Rays for every Automation you add',
        }}
      />
      <BoostCards />
      <Dial value={280} max={400} subtext="Eligible" icon="rays" iconSize={48} />
    </div>
  )
}
