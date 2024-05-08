import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hello!',
  description: 'We be developing app v2',
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head></head>
      <body>{children}</body>
    </html>
  )
}
