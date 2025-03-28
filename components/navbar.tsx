"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { subscribeToAuthChanges } from "@/lib/auth-service"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user)
    })

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "anatolion-header py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src="/images/logo.png" alt="Anatolion Guild Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold anatolion-title hidden sm:block">Anatolion Guild</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="anatolion-nav-link">
              Home
            </Link>
            <Link href="/about" className="anatolion-nav-link">
              About
            </Link>
            <Link href="/roster" className="anatolion-nav-link">
              Roster
            </Link>
            <Link href="/events" className="anatolion-nav-link">
              Events
            </Link>
            <Link href="/parties" className="anatolion-nav-link">
              Parties
            </Link>
            <Link href="/gallery" className="anatolion-nav-link">
              Gallery
            </Link>
            <Link href="/contact" className="anatolion-nav-link">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="anatolion-button">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button className="anatolion-button">Join Guild</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 text-[#e8deb3]" /> : <Menu className="h-6 w-6 text-[#e8deb3]" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden anatolion-sidebar py-4 px-4 absolute top-full left-0 right-0">
          <div className="flex flex-col gap-4">
            <Link href="/" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/about" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              About
            </Link>
            <Link href="/roster" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Roster
            </Link>
            <Link href="/events" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Events
            </Link>
            <Link href="/parties" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Parties
            </Link>
            <Link href="/gallery" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Gallery
            </Link>
            <Link href="/contact" className="anatolion-nav-link py-2" onClick={toggleMenu}>
              Contact
            </Link>

            {isAuthenticated ? (
              <Link href="/dashboard" onClick={toggleMenu}>
                <Button className="anatolion-button w-full">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/signup" onClick={toggleMenu}>
                <Button className="anatolion-button w-full">Join Guild</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

