import { Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

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
        Hello 🙌 If youre seeing this page, it means that the app is running correctly.
        <br />
        Have a great day, I love you ❤️❤️
        <br /> <br />
        BTW you are probably looking for the{' '}
        <Link href="/earn" style={{ display: 'inline', color: 'var(--color-text-link)' }}>
          Earn page
        </Link>
      </Text>
    </div>
  )
}
