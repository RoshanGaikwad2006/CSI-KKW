import { Home } from '../src/screens/Home'
import SEO from '../src/components/SEO'
import { getOrganizationSchema, getWebSiteSchema } from '../src/lib/schema'

export default function HomePage() {
  return (
    <>
      <SEO
        canonical="/"
        jsonLd={[getOrganizationSchema(), getWebSiteSchema()]}
      />
      <Home />
    </>
  )
}
