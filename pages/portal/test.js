import dynamic from 'next/dynamic'
import SEO from '../../src/components/SEO'

const Test = dynamic(() => import('../../src/portal/test').then((mod) => mod.Test), {
  ssr: false,
})

export default function TestPage() {
  return (
    <>
      <SEO
        title="Campus to Corporate (C2C) Aptitude Assessment | CSI KKWIEER"
        description="Official Campus to Corporate (C2C) Technical and Aptitude Assessment Portal."
        noindex={true}
      />
      <Test />
    </>
  )
}
