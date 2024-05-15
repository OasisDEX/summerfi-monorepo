import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'

import { fontFtPolar, fontInter } from '@/helpers/fonts'

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
      <body className={`${fontFtPolar.variable} ${fontInter.variable}`}>{children}</body>
    </html>
  )
}
