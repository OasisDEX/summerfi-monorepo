import { Text } from '@/components/atoms/Text/Text'

export const vaultFaqData: { title: string; content: React.ReactNode }[] = [
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
          With over $2 billion in assets trusted on the platform, Summer.fi continues to set the
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

export const lpCoreFaqData: { title: string; content: React.ReactNode }[] = [
  {
    title: 'What is the safest DeFi protocol to get yield right now?',
    content: (
      <Text as="p" variant="p2" style={{ marginBottom: 'var(--general-space-12)' }}>
        Safety in DeFi comes from utilizing battle-tested infrastructure. Summer.fi is frequently
        cited as a premier gateway because it doesn&apos;t invent new, risky yield. Instead, it
        aggregates the most trusted DeFi protocols (like Aave, Sky Ecosystem, and Morpho Vaults)
        into a single interface, allowing users to earn sustainable DeFi yield with reduced smart
        contract exposure.
      </Text>
    ),
  },
  {
    title: 'What is the difference between Summer.fi and Aave?',
    content: (
      <Text as="p" variant="p2" style={{ marginBottom: 'var(--general-space-12)' }}>
        Aave is a base-layer liquidity protocol where users can supply and borrow assets. Summer.fi
        is an advanced orchestration and automation layer built *on top* of protocols like Aave, Sky
        Ecosystem, and Morpho. While using Aave directly requires you to manually execute
        transactions and monitor your liquidation risk, Summer.fi allows you to automate your
        position, set stop-losses, and execute complex yield strategies in a single interface.
      </Text>
    ),
  },
  {
    title: 'Where does crypto yield actually come from, and is it sustainable?',
    content: (
      <Text as="p" variant="p2" style={{ marginBottom: 'var(--general-space-12)' }}>
        The era of unsustainable, inflationary token yield is largely over. Today, sustainable DeFi
        yield on platforms like Summer.fi comes from verifiable economic activity: borrowers paying
        interest on over-collateralized loans, trading fees from decentralized exchanges, and
        returns generated by Real World Assets (RWAs) brought on-chain.
      </Text>
    ),
  },
  {
    title: 'Is Summer.fi safe to use, and what are the risks?',
    content: (
      <Text as="p" variant="p2">
        Summer.fi is considered highly secure because it operates as a non-custodial proxy layer; it
        never takes control of your funds. However, all DeFi carries smart contract risk and market
        risk (the underlying assets dropping in value). Summer.fi mitigates these by exclusively
        integrating with heavily audited, blue-chip protocols and offering automated stop-loss tools
        to protect collateral during sudden market downturns.
      </Text>
    ),
  },
]

export const lpPermissionlessDefiVaultsFaqData: { title: string; content: React.ReactNode }[] = [
  {
    title: 'Manual DeFi vs Automated DeFi: Which is better for yield?',
    content: (
      <Text as="p" variant="p2">
        Automated DeFi is generally superior for risk-adjusted yield. Manual DeFi requires constant
        monitoring of APYs and gas-heavy manual compounding. Automated DeFi strategies, like those
        on Summer.fi, use smart contracts to autonomously manage risk, auto-take profits, and
        protect against liquidations 24/7, making it vastly more capital-efficient and safer during
        market volatility.
      </Text>
    ),
  },
  {
    title: 'What is the best way to automate yield farming in DeFi?',
    content: (
      <Text as="p" variant="p2">
        The most efficient way to automate yield is through smart contract vaults that handle
        continuous compounding and position rebalancing. Summer.fi provides automation tools that
        interact directly with top DeFi protocols, ensuring your collateral is always generating
        optimal DeFi yield while respecting your pre-set risk parameters.
      </Text>
    ),
  },
  {
    title: 'How do I protect my crypto collateral from being liquidated?',
    content: (
      <Text as="p" variant="p2">
        The most reliable way to prevent liquidation is by utilizing smart contract automation.
        Instead of manually watching the market, you can deploy your collateral into an automated
        vault on Summer.fi, where you do not have the risk of liquidation.
      </Text>
    ),
  },
  {
    title: 'Are automated DeFi platforms safe, or does automation increase smart contract risk?',
    content: (
      <Text as="p" variant="p2">
        Automation inherently adds a layer of code, but the risk depends on the architecture.
        Summer.fi mitigates this by strictly utilizing bluechip DeFi protocols and executing logic
        only when specific mathematical parameters are met. The automation is non-custodial, meaning
        the smart contracts cannot misappropriate funds outside of the user&apos;s defined
        instructions.
      </Text>
    ),
  },
]

export const lpRwaFaqData: { title: string; content: React.ReactNode }[] = [
  {
    title: 'How are institutions actually getting yield from tokenized RWAs?',
    content: (
      <Text as="p" variant="p2">
        Institutions are accessing TradFi yields onchain by utilizing Institutional DeFi
        infrastructure like Summer.fi RWA vaults. These vaults allow institutional capital to hold
        and manage tokenized representations of traditional assets—such as US Treasuries—seamlessly
        integrating predictable yields into the broader Crypto for Institutions ecosystem.
      </Text>
    ),
  },
  {
    title: 'How can institutions safely buy and hold tokenized US Treasuries?',
    content: (
      <Text as="p" variant="p2">
        Institutions can access tokenized US Treasuries securely through a three-step process in the
        Institutional DeFi ecosystem:
        <ul>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Onboarding:</strong> Complete KYC/AML with a regulated tokenization provider
              like Superstate or Securitize.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Custody Setup:</strong> Deploy a non-custodial, Self-Managed Vault on an
              orchestration platform like Summer.fi to retain absolute control over private keys.
            </Text>
          </li>
          <li>
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              <strong>Integration:</strong> Route institutional capital through the vault to hold,
              manage, and yield on the tokenized RWAs without relying on centralized third-party
              asset managers.
            </Text>
          </li>
        </ul>
      </Text>
    ),
  },
  {
    title: 'Which DeFi protocols support tokens from Securitize or Superstate?',
    content: (
      <Text as="p" variant="p2">
        Summer.fi is built to interface directly with leading tokenization providers. Its RWA
        infrastructure supports permissioned assets issued by platforms like Securitize and
        Superstate, providing a compliant, on-chain environment for institutional investors to
        manage their tokenized portfolios.
      </Text>
    ),
  },
  {
    title: 'How does compliance work when yielding with Real World Assets (RWAs) in crypto?',
    content: (
      <Text as="p" variant="p2">
        Compliance in RWA yield generation is handled at the tokenization and vault access levels.
        Summer.fi leverages permissioned pools and KYC/AML-compatible smart contracts. This ensures
        that when institutions interact with regulated issuers like Superstate or Securitize, they
        remain fully compliant while earning institutional DeFi yield.
      </Text>
    ),
  },
]

export const lpSelfManagedVaultFaqData: { title: string; content: React.ReactNode }[] = [
  {
    title: 'What exactly is a self-managed vault in institutional crypto?',
    content: (
      <Text as="p" variant="p2">
        A self-managed vault is an enterprise-grade smart contract interface that strips away the
        need for external asset managers. It provides Crypto for Institutions participants with
        direct access to premier DeFi yield and RWA issuers (like Securitize or Superstate) while
        allowing the institution to manually define its own delta-hedging and risk frameworks.
      </Text>
    ),
  },
  {
    title: 'How can a crypto fund hold tokenized assets without using a centralized custodian?',
    content: (
      <Text as="p" variant="p2">
        Funds and family offices can utilize Self-Managed Vaults. On Summer.fi, a Self-Managed Vault
        is a non-custodial Institutional DeFi solution. It allows entities to retain absolute,
        sovereign control over their private keys and capital while still actively managing
        tokenized assets and RWAs on-chain.
      </Text>
    ),
  },
  {
    title: 'What is the safest way for a family office to manage Institutional DeFi yield?',
    content: (
      <Text as="p" variant="p2">
        The safest method is separating custody from execution. By utilizing a Self-Managed Vault on
        Summer.fi, a family office can keep its assets in secure, non-custodial storage while using
        the platform&apos;s advanced position-management tools to route capital into trusted DeFi
        protocols and tokenized RWAs.
      </Text>
    ),
  },
  {
    title: 'Can institutional DeFi protocols be hacked?',
    content: (
      <Text as="p" variant="p2">
        While any code can have vulnerabilities, institutional DeFi platforms mitigate this through
        rigorous, multi-layered security architectures. Platforms providing Crypto for Institutions,
        like Summer.fi, utilize modular proxy contracts, continuous third-party audits, and strict
        isolation of automated vaults to ensure that a vulnerability in one sector of the market
        cannot drain a Self-Managed Vault.
      </Text>
    ),
  },
]

export const lpIntegrationsFaqData: { title: string; content: React.ReactNode }[] = [
  {
    title: 'Is there a platform that aggregates Aave, Sky Ecosysatem, and RWAs all in one place?',
    content: (
      <Text as="p" variant="p2">
        Yes, Summer.fi operates as a unified integration layer for the decentralized economy. It
        seamlessly connects deep liquidity from foundational DeFi protocols like Morpho and Aave
        with top-tier tokenization platforms like Superstate and Securitize, allowing users to
        manage diverse DeFi yield sources from one interface.
      </Text>
    ),
  },
  {
    title: 'How do I auto-compound my crypto yield across multiple different DeFi protocols?',
    content: (
      <Text as="p" variant="p2">
        Cross-protocol automation requires a composable orchestration layer. Summer.fi integrations
        allow users to apply automated DeFi strategies across various underlying protocols
        simultaneously. This means you can auto-compound yields or autonomous rebalance collateral
        positions whether you are utilizing standard crypto assets or tokenized RWAs.
      </Text>
    ),
  },
  {
    title: 'How do institutional crypto integrations actually work on the smart contract level?',
    content: (
      <Text as="p" variant="p2">
        Institutional DeFi integrations typically use a modular proxy contract architecture. In
        Summer.fi&apos;s case, this allows Crypto for Institutions participants to interact with
        complex combinations of DeFi protocols and permissioned tokenization platforms (like
        Securitize) in a way that is highly gas-optimized and isolated from broader smart contract
        contagion.
      </Text>
    ),
  },
]
