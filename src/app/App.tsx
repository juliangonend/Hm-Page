import { ContactModalProvider } from '../features/contact/application/ContactModalProvider'
import { NavBar } from '../features/layout/NavBar'
import { Footer } from '../features/layout/Footer'
import { ScrollBall } from '../features/layout/scroll-ball/ScrollBall'
import { Hero } from '../features/hero/Hero'
import { StatsBand } from '../features/stats/StatsBand'
import { AboutSection } from '../features/about/AboutSection'
import { TrainingsSection } from '../features/trainings/TrainingsSection'
// import { UpcomingEventsSection } from '../features/dynamic-cards/ui/UpcomingEventsSection' // hidden until the back office is ready
import { ClubsSection } from '../features/clubs/ClubsSection'
import { TrustedClubsWallSection } from '../features/clubs/trusted-clubs/TrustedClubsWallSection'
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
      {/*
        TODO: "Próximos eventos" is hidden until the back office is ready.
        To enable it: plug the backend adapter in
        src/features/dynamic-cards/infrastructure/index.ts → createCardRepository(),
        then uncomment this line and its import above.
        <UpcomingEventsSection />
      */}
      <ClubsSection />
      <TrustedClubsWallSection />
      <CoachesSection />
      <ContactSection />
    </main>
    <Footer />
  </ContactModalProvider>
)
