import { Test } from '../../src/portal/test'
import SEO from '../../src/components/SEO'

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
