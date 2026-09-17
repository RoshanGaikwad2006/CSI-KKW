import Head from 'next/head'
import '../styles/globals.css'
import '../src/index.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CSI KKWIEER Student Branch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/csi.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}