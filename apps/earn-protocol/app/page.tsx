import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      Hello 🙌 If youre seeing this page, it means that the app is running correctly. Have a great
      day, I love you ❤️ BTW you are probably looking for <Link href="/earn">Earn page</Link>
    </div>
  )
}
