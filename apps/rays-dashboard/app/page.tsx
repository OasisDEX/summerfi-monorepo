import { icons } from '@summerfi/app-tokens'
import { Button, GenericTokenIcon, Icon, Text, TokensGroup } from '@summerfi/app-ui'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-start' }}>
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
      <Icon icon={icons.btc_circle_color} />
      <TokensGroup tokens={['ETH', 'Dummy']} />
      <Text as="p" variant="p2semi">
        Text component p with p2semi variant with <Link href="/">link</Link> inline
      </Text>
    </div>
  )
}