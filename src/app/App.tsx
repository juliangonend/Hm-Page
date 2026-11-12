import { ContactModalProvider } from '../features/contact/application/ContactModalProvider'
import { NavBar } from '../features/layout/NavBar'
import { Footer } from '../features/layout/Footer'
import { ScrollBall } from '../features/layout/scroll-ball/ScrollBall'
import { Hero } from '../features/hero/Hero'
import { StatsBand } from '../features/stats/StatsBand'
import { AboutSection } from '../features/about/AboutSection'
import { TrainingsSection } from '../features/trainings/TrainingsSection'
import { UpcomingEventsSection } from '../features/dynamic-cards/ui/UpcomingEventsSection'
import { hasApi } from '../shared/api/apiBase'
import { ClubsSection } from '../features/clubs/ClubsSection'
import { TrustedClubsWallSection } from '../features/clubs/trusted-clubs/TrustedClubsWallSection'
import { TestimonialsSection } from '../features/testimonials/TestimonialsSection'
import { CoachesSection } from '../features/coaches/CoachesSection'
import { ContactSection } from '../features/contact/ui/ContactSection'

export const App = () => (
  <ContactModalProvider>
    <NavBar />
    <ScrollBall />
    <main>
      <Hero />
      <StatsBand />
      <AboutSection />
      <TrainingsSection />
      {/* "Próximos eventos" only exists where the PHP back office is deployed (Hostinger build) */}
      {hasApi() && <UpcomingEventsSection />}
      <ClubsSection />
      <TrustedClubsWallSection />
      <TestimonialsSection />
      <CoachesSection />
      <ContactSection />
    </main>
    <Footer />
  </ContactModalProvider>
)
