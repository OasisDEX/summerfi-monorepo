import {
  BannerCard,
  Button,
  GenericTokenIcon,
  Icon,
  ProtocolLabel,
  Text,
  TokensGroup,
  Tooltip,
} from '@summerfi/app-ui'
import Link from 'next/link'
import automationIcon from 'public/img/banners/boost-banner-1.svg'
import multiplyIcon from 'public/img/banners/boost-banner-2.svg'
import protocolsIcon from 'public/img/banners/boost-banner-3.svg'
import migrateIcon from 'public/img/banners/boost-banner-4.svg'

import { automationItems, ProductCard } from '@/components/molecules/ProductCard'
import { NetworkNames, networksByName } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

const boostCards = [
  {
    title: 'Enable automation to your active positions',
    description:
      'Automation help protect your positions from unexpected losses, and optimise their performance',
    footer: 'Boost Rays by up to 1.5X',
    button: {
      label: 'Add automation to your positions',
      action: () => null,
    },
    image: {
      src: automationIcon,
      alt: 'automation-icon',
    },
  },
  {
    title: 'Trade using Multiply and Yield Loops',
    description:
      'Perform a Multiply trade within Summer.fi, or open, close or adjust a Yield Loop position - you will instantly earn up to 20% of your yearly points total instantly. ',
    footer: 'Get instant Rays plus boosts for repeated use',
    button: {
      label: 'Start Trading now',
      action: () => null,
    },
    image: {
      src: multiplyIcon,
      alt: 'multiply-icon',
    },
  },
  {
    title: 'Use more protocols through Summer.fi ',
    description:
      'Earn up to 3X the Rays for each open position when you’re using 5 or more Protocols. ',
    footer: 'Boost the Rays on ALL your open positions',
    button: {
      label: 'Explore other protocols',
      action: () => null,
    },
    image: {
      src: protocolsIcon,
      alt: 'protocols-icon',
    },
  },
  {
    title: 'Migrate a DeFi position in from elsewhere',
    description:
      'If you have supported DeFi positions managed through other interfaces, import them into Summer.fi using our migration tool ',
    footer: 'Earn 20% of the years points instantly',
    button: {
      label: 'Migrate existing position',
      action: () => null,
    },
    image: {
      src: migrateIcon,
      alt: 'migrate-icon',
    },
  },
]

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
      {boostCards.map((item) => (
        <BannerCard
          key={item.title}
          title={item.title}
          description={item.description}
          footer={
            <Text as="span" variant="p4semiColorful">
              {item.footer}
            </Text>
          }
          button={item.button}
          image={item.image}
        />
      ))}
    </div>
  )
}
