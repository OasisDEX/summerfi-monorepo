import { GlobalStyles } from '@summerfi/app-ui'
import type { Metadata } from 'next'

import { MasterPage } from '@/components/layout/MasterPage/MasterPage'
import { fontFtPolar, fontInter } from '@/helpers/fonts'

export const metadata: Metadata = {
  title: 'Summer.fi Rays',
  description: 'Something cool is coming. The future is bright. The future is sunny.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GlobalStyles />
      </head>
      <body className={`${fontFtPolar.variable} ${fontInter.variable}`}>
        <MasterPage>{children}</MasterPage>
      </body>
    </html>
  )
}
