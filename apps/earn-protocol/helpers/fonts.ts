import localFont from 'next/font/local'

export const fontInter = localFont({
  src: [
    {
      path: '../public/fonts/inter-variable.ttf',
    },
  ],
  display: 'block',
  variable: '--font-inter',
  preload: true,
})
