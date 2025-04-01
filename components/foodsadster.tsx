import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="anatolion-footer py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 anatolion-title">Anatolion Guild</h3>
            <p className="text-sm opacity-80">
              A premier Throne and Liberty guild focused on PvP, PvE, and community building.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-80 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm opacity-80 hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link href="/roster" className="text-sm opacity-80 hover:opacity-100">
                  Roster
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm opacity-80 hover:opacity-100">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/parties" className="text-sm opacity-80 hover:opacity-100">
                  Parties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-sm opacity-80 hover:opacity-100">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm opacity-80 hover:opacity-100">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-sm opacity-80 hover:opacity-100">
                  Guild Rules
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm opacity-80 hover:opacity-100">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm opacity-80 hover:opacity-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8deb3] hover:text-white"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8deb3] hover:text-white"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8deb3] hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8deb3] hover:text-white"
              >
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-sm opacity-80">Join our Discord community for the latest updates and events.</p>
            <a
              href="https://discord.gg/X3BBdDZbKG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 anatolion-button rounded text-sm"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

