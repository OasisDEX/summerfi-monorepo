import { type ReactNode } from 'react'
import { type Metadata } from 'next'

import '@/styles/global.css'

import { fontInter } from '@/helpers/fonts'
import { Web3Provider } from '@/providers/Web3Provider'

export const metadata: Metadata = {
  title: 'Summer.fi',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={fontInter.variable} style={{ background: 'rgb(16, 16, 16)' }}>
        <Web3Provider>{children}</Web3Provider>
        {/* app-earn-ui Modal/tooltip portal target — required by the design system */}
        <div id="portal" style={{ position: 'absolute' }} />
      </body>
    </html>
  )
}
