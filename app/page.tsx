import Link from "next/link"
import Image from "next/image"
import { Calendar, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="home-content">
      <Image
        src="/assets/anatolion-logo.png"
        alt="Anatolion Guild Logo"
        width={450}
        height={200}
        className="guild-logo"
      />

      <p className="guild-motto">
        Welcome to our elite and supportive guild. At Anatolion, we believe that the greatest adventures are those
        shared with allies. Join us to experience Throne and Liberty in a community that values strategy, camaraderie,
        and helping each other conquer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mb-12">
        <Link href="/parties" className="flex-1">
          <div className="feature-card h-full flex flex-col items-center justify-center p-8 text-center hover:border-[#ffd587] transition-all">
            <div className="feature-icon mb-4 flex items-center justify-center">
              <Users className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold mb-2">Party Management</h3>
            <p>Organize your raid parties with our drag-and-drop interface</p>
          </div>
        </Link>

        <Link href="/events" className="flex-1">
          <div className="feature-card h-full flex flex-col items-center justify-center p-8 text-center hover:border-[#ffd587] transition-all">
            <div className="feature-icon mb-4">
              <Calendar className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold mb-2">Event Calendar</h3>
            <p>Track guild activities and sign up for upcoming events</p>
          </div>
        </Link>
      </div>

      <section className="features" id="community">
        <h2 className="features-title">Our Community Values</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="feature-title">Elite Brotherhood</h3>
            <p className="feature-desc">
              Join a dedicated alliance of players who value skill, strategy, and supporting each other in all battles
              across Throne and Liberty.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3 className="feature-title">Support & Growth</h3>
            <p className="feature-desc">
              Whether you're a veteran or new to the game, our members are always ready to offer advice, run dungeons
              together, and help with gear progression.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="feature-title">Regular Events</h3>
            <p className="feature-desc">
              From weekly guild activities to special themed nights, we create fun and engaging experiences that bring
              our community closer together.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section" id="recruitment">
        <h2 className="cta-title">Join Our Guild</h2>
        <p className="cta-desc">
          Anatolion seeks dedicated warriors and tacticians to join our ranks. We welcome players who demonstrate skill
          and commitment, who value strategic gameplay, honor, and the glory of conquest.
        </p>
        <div className="cta-buttons">
          <a href="https://discord.gg/X3BBdDZbKG" className="button">
            <i className="fab fa-discord mr-2"></i> Join Discord
          </a>
          <Link href="/parties" className="secondary-button">
            View Parties
          </Link>
        </div>
      </section>
    </div>
  )
}

