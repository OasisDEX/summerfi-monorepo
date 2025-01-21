import localFont from 'next/font/local'

export const fontFtPolar = localFont({
  src: [
    {
      path: '../public/fonts/ft-polar-bold.woff2',
      weight: '700',
    },
    {
      path: '../public/fonts/ft-polar-regular.woff2',
      weight: '400',
    },
  ],
  display: 'swap',
  variable: '--font-ft-polar',
  preload: true,
})

export const fontInter = localFont({
  src: [
    {
      path: '../public/fonts/inter-bold.woff2',
      weight: '700',
    },
    {
      path: '../public/fonts/inter-semi-bold.woff2',
      weight: '600',
    },
    {
      path: '../public/fonts/inter-regular.woff2',
      weight: '400',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})
