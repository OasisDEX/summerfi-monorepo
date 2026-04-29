import localFont from 'next/font/local'

export const fontInter = localFont({
  src: [
    {
      path: '../public/fonts/inter.woff2',
    },
  ],
  weight: '400 700',
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
