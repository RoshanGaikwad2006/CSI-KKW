import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import '../src/index.css'
import ParticleCanvas from '../src/components/ui/ParticleCanvas'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  // Ensure scroll is never locked when navigating between pages
  useEffect(() => {
    const handleRouteChange = () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeError', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleRouteChange)
    }
  }, [router])

  return (
    <>
      <Head>
        <title>CSI KKWIEER Student Branch</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/csi.png" />
      </Head>
      <ParticleCanvas />
      <Component {...pageProps} />
    </>
  )
}