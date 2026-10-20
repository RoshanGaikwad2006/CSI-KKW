import { Gallery } from '../src/screens/Gallery'
import SEO from '../src/components/SEO'
import { getBreadcrumbSchema } from '../src/lib/schema'

export default function GalleryPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Event Gallery", path: "/gallery" },
  ])

  return (
    <>
      <SEO
        title="Event Gallery & Community Highlights"
        description="Browse photos, ceremonies, technical symposiums, hackathon memories, and event highlights from CSI KKWIEER Student Branch activities."
        canonical="/gallery"
        keywords={[
          "CSI KKWIEER Gallery",
          "CSI Event Photos",
          "KKWIEER Engineering Gallery",
          "Hackathon Highlights",
          "Installation Ceremony Photos",
          "CSI Student Branch Memories Nashik"
        ]}
        jsonLd={[breadcrumbSchema]}
      />
      <Gallery />
    </>
  )
}
