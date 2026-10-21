import dynamic from 'next/dynamic'
import SEO from '../../src/components/SEO'

const Test = dynamic(() => import('../../src/portal/test').then((mod) => mod.Test), {
  ssr: false,
})

export default function TestPage() {
  return (
    <>
      <SEO
        title="Student Assessment Portal"
        description="CSI KKWIEER Student Technical Assessment and Screening Portal."
        noindex={true}
      />
      <Test />
    </>
  )
}
