import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hello!',
  description: 'We be developing app v2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GlobalStyles />
      </head>
      <body>{children}</body>
    </html>
  )
}
