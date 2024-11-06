import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

export const revalidate = 60

export default function HomePage() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Text as="p" variant="p2">
        I love you ❤️
        <br /> <br />
        BTW you are probably looking for the{' '}
        <Link href="/earn" style={{ display: 'inline', color: 'var(--color-text-link)' }}>
          Earn page
        </Link>
      </Text>
    </div>
  )
}
