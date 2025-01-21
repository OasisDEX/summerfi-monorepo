import localFont from 'next/font/local'

export const fontInter = localFont({
  src: [
    {
      path: '../public/fonts/inter-variable.ttf',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})
