import { Html, Head, Main, NextScript } from 'next/document'
import i18nextConfig from '../../next-i18next.config'
import { NextPageContext } from 'next'
type DocumentProps = {
  __NEXT_DATA__: NextPageContext
}
export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  const currentLocale = __NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale
  return (
    <Html lang={currentLocale}>
      <Head>
        <meta charSet="utf-8" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="WuKong CMS" />
        {/* <link
            href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css"
            rel="stylesheet"
          />
          <link href="/app.css" rel="stylesheet" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
