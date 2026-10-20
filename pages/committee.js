import { Committee } from '../src/screens/Committee'
import SEO from '../src/components/SEO'
import { getBreadcrumbSchema } from '../src/lib/schema'

export default function CommitteePage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Core Committee", path: "/committee" },
  ])

  return (
    <>
      <SEO
        title="Executive Committee & Core Team"
        description="Meet the core executive student committee, coordinators, and mentors of Computer Society of India (CSI) Student Branch at KKWIEER Nashik."
        canonical="/committee"
        keywords={[
          "CSI KKWIEER Committee",
          "CSI Core Team",
          "KKWIEER Student Leaders",
          "Computer Society of India Nashik",
          "Student Coordinators",
          "CSI Executive Board",
          "KKWIEER Computer Engineering Leadership"
        ]}
        jsonLd={[breadcrumbSchema]}
      />
      <Committee />
    </>
  )
}
