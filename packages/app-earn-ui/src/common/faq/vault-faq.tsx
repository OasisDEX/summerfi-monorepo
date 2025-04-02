import { Text } from '@/components/atoms/Text/Text'

export const vaultFaqData = [
  {
    title: 'Why trust Summer.fi with your funds?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Summer.fi is one of DeFi’s oldest and most trusted platforms, renowned for curating the
          best protocols and making them easily accessible through innovative features like Stop
          Loss and Multiply.
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          With over $4 billion in assets trusted on the platform, Summer.fi continues to set the
          standard in DeFi reliability. Our original app, Summer.fi Pro, remains a cornerstone of
          DeFi innovation, now complemented by the revolutionary Lazy Summer Protocol.
        </Text>
        <Text as="p" variant="p2">
          With Summer.fi, Security is at the heart of everything we do. We’ve partnered with
          ChainSecurity and Prototech Labs to perform comprehensive audits of the Lazy Summer
          Protocol, ensuring your funds are protected by best-in-class technology and practices.
        </Text>
      </>
    ),
  },
  {
    title: 'How does the strategy work?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          The Lazy Summer Protocol leverages cutting-edge <strong>rebalancing technology</strong> to
          curate and allocate assets across DeFi’s highest-performing strategies. Here’s how:
        </Text>
        <ul
          style={{
            listStyleType: 'disc',
            paddingLeft: 'var(--general-space-32)',
            marginBottom: 'var(--general-space-12)',
          }}
        >
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>The Rebalancer</strong> identifies and shifts funds from underperforming
              strategies (ARKs) to higher-yielding ones.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Governed by <strong>FleetCommander</strong>, strict constraints ensure funds are moved
              responsibly, with limits on frequency and volume.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Initially, a whitelist of trusted Keepers manages rebalancing. Over time, this process
              will become fully <strong>permissionless</strong>, governed entirely by protocol users
            </Text>
          </li>
        </ul>
        <Text as="p" variant="p2">
          Regular third-party reports ensure complete transparency, flagging any activity that
          doesn’t align with the protocol’s best interests. In short, your assets work smarter, not
          harder.
        </Text>
      </>
    ),
  },
  {
    title: 'Where does the yield come from?',
    content: (
      <>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          Summer.fi optimizes yields from DeFi’s most trusted protocols, including{' '}
          <strong> AAVE V3, Spark, Morpho, Gearbox, Fluid, Pendle, Sky, and Compound V3.</strong>
        </Text>
        <Text
          as="p"
          variant="p2"
          style={{
            marginBottom: 'var(--general-space-12)',
          }}
        >
          These yields are generated through four core strategies:
        </Text>
        <ul
          style={{
            listStyleType: 'disc',
            paddingLeft: 'var(--general-space-32)',
            marginBottom: 'var(--general-space-12)',
          }}
        >
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Lending:</strong> Earn interest by providing liquidity to borrowers.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Basis Trading:</strong> Capitalize on price differences between spot and
              futures markets.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Rates Trading:</strong> Markets for traders to speculate on interest rate
              fluctuations in DeFi.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Yield Farming:</strong> Earn rewards by staking or providing liquidity to
              protocols.
            </Text>
          </li>
        </ul>
        <Text as="p" variant="p2">
          The Lazy Summer <strong>Rebalancer</strong> ensures your funds are always in the
          highest-performing strategies, so you earn more, effortlessly.
        </Text>
      </>
    ),
  },
]
