import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Anatolion Guild - Throne and Liberty",
  description: "Official website of the Anatolion Guild for Throne and Liberty",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
      </head>
      <body>
        <div className="side-border-left"></div>
        <div className="side-border-right"></div>

        <div className="container">
          <header>
            <div className="logo-container">
              <Link href="/">
                <Image
                  src="/assets/guild-crest.png"
                  alt="Anatolion Guild Crest"
                  width={80}
                  height={80}
                  className="guild-crest"
                />
              </Link>
              <span className="guild-tag">ANATOLION</span>
            </div>

            <div className="menu-container">
              <div className="menu-title"></div>
              <nav>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/parties">Parties</Link>
                  </li>
                  <li>
                    <Link href="/events">Events</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <a href="https://discord.gg/X3BBdDZbKG" className="discord-btn">
              <i className="fab fa-discord"></i> Join Discord
            </a>
          </header>

          <main>{children}</main>

          <footer>
            <div className="footer-content">
              <Image
                src="/assets/guild-crest.png"
                alt="Anatolion Guild Crest"
                width={60}
                height={60}
                className="footer-logo"
              />

              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/parties">Parties</Link>
                <Link href="/events">Events</Link>
              </div>

              <div className="platform-icons">
                <a href="https://discord.gg/X3BBdDZbKG">
                  <i className="fab fa-discord platform-icon"></i>
                </a>
                <i className="fab fa-steam platform-icon"></i>
                <i className="fab fa-youtube platform-icon"></i>
              </div>
            </div>
            <p className="mt-4 text-center">© {new Date().getFullYear()} Anatolion Guild. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}



import './globals.css'