import localFont from 'next/font/local'

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
  display: 'block',
  variable: '--font-inter',
  preload: true,
})
