import { type ReactNode } from 'react'
import { GlobalStyles } from '@summerfi/app-earn-ui'
import { type Metadata } from 'next'

import { fontInter } from '@/helpers/fonts'
import { Web3Provider } from '@/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'Summer.fi',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GlobalStyles />
      </head>
      <body className={fontInter.variable} style={{ background: 'rgb(16, 16, 16)' }}>
        <Web3Provider>{children}</Web3Provider>
        {/* app-earn-ui Modal/tooltip portal target — required by the design system */}
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
