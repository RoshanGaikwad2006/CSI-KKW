import { Events } from '../src/screens/Events'
import SEO from '../src/components/SEO'
import { getBreadcrumbSchema, getEventSchema } from '../src/lib/schema'
import { eventsData } from '../src/data/eventsData'

export default function EventsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([{ name: "Events", path: "/events" }])
  const eventSchemas = eventsData.slice(0, 6).map(getEventSchema)

  return (
    <>
      <SEO
        title="Upcoming Technical Events & Workshops"
        description="Explore upcoming technical workshops, hackathons, industry expert sessions, and coding competitions organized by CSI KKWIEER Student Branch, Nashik. Register online."
        canonical="/events"
        keywords={[
          "CSI KKWIEER Events",
          "Tech Workshops Nashik",
          "Hackathons KKWIEER",
          "Vision Week 2026",
          "Eyantran",
          "Engineering Seminars",
          "CSI Events",
          "Coding Competitions",
          "Student Workshops KKWIEER"
        ]}
        jsonLd={[breadcrumbSchema, ...eventSchemas]}
      />
      <Events />
    </>
  )
}
