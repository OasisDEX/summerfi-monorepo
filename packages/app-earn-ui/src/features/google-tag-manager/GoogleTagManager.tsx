import { type FC } from 'react'
import Script from 'next/script'

const GTM_ID = 'GTM-PWFF39MK'

export const GoogleTagManager: FC = () => {
  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </noscript>
    </>
  )
}
