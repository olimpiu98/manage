import Link from "next/link"
import Image from "next/image"

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
          <Link href="/register" className="button">
            Register Now
          </Link>
          <Link href="/parties" className="secondary-button">
            View Parties
          </Link>
        </div>
      </section>
    </div>
  )
}

