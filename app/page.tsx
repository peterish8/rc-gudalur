import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import BoardMembers from "@/components/board-members"
import EventsSection from "@/components/events-section"
import GallerySection from "@/components/gallery-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BoardMembers />
      <EventsSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
