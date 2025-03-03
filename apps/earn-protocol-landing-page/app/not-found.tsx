import { Button, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 'var(--general-space-64)',
        marginTop: 'var(--general-space-64)',
      }}
    >
      <Text
        as="h3"
        variant="h3"
        style={{
          marginBottom: 'var(--general-space-64)',
        }}
      >
        Sorry, page not found!
      </Text>
      <Link href="/">
        <Button variant="primaryLarge">Go back to the homepage</Button>
      </Link>
    </div>
  )
}
